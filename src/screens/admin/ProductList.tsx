import React, { useState, useEffect } from 'react';
import { Search, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { ConfirmModal } from '../../components/ConfirmModal';

interface ProductListProps {
    // Empty for now, can add props later if needed
}

interface Word {
    id: number;
    word: string;
    chinese: string;
    phonetic: string;
    image_url: string | null;
    category_id: number;
    category_name: string;
    category_display_name: string;
    created_at: string;
    is_approved?: boolean;
}

interface Category {
    id: number;
    name: string;
    display_name: string;
}

export const ProductList: React.FC<ProductListProps> = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Selection
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    // Modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'success' | 'warning';
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'warning', onConfirm: () => { } });

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [wordsRes, catsRes] = await Promise.all([
                fetch('http://localhost:3001/api/words'),
                fetch('http://localhost:3001/api/categories')
            ]);
            const wordsData = await wordsRes.json();
            const catsData = await catsRes.json();
            setWords(wordsData);
            setCategories(catsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredWords = words.filter(word => {
        const matchesSearch = searchQuery === '' ||
            word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            word.chinese.includes(searchQuery);
        const matchesCategory = selectedCategory === 'all' ||
            word.category_name === selectedCategory ||
            word.category_id.toString() === selectedCategory;
        const matchesStatus = selectedStatus === 'all' ||
            (selectedStatus === 'approved' && word.is_approved) ||
            (selectedStatus === 'pending' && !word.is_approved);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Selection handlers
    const toggleSelect = (id: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const selectAll = () => {
        if (selectedIds.size === filteredWords.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredWords.map(w => w.id)));
        }
    };

    // Bulk actions
    const bulkApprove = async () => {
        setModalConfig({
            isOpen: true,
            title: '批量审核',
            message: `确定要审核通过 ${selectedIds.size} 个项目吗？`,
            type: 'success',
            onConfirm: async () => {
                try {
                    for (const id of selectedIds) {
                        await fetch(`http://localhost:3001/api/words/${id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ is_approved: true })
                        });
                    }
                    setSelectedIds(new Set());
                    loadData();
                } catch (error) {
                    console.error('Bulk approve failed:', error);
                }
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const bulkDelete = async () => {
        setModalConfig({
            isOpen: true,
            title: '批量删除',
            message: `确定要删除 ${selectedIds.size} 个项目吗？此操作不可撤销。`,
            type: 'danger',
            onConfirm: async () => {
                try {
                    for (const id of selectedIds) {
                        await fetch(`http://localhost:3001/api/words/${id}`, { method: 'DELETE' });
                    }
                    setSelectedIds(new Set());
                    loadData();
                } catch (error) {
                    console.error('Bulk delete failed:', error);
                }
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    // Single item actions
    const handleDelete = (id: number, word: string) => {
        setModalConfig({
            isOpen: true,
            title: '删除单词',
            message: `确定要删除 "${word}" 吗？此操作不可撤销。`,
            type: 'danger',
            onConfirm: async () => {
                try {
                    await fetch(`http://localhost:3001/api/words/${id}`, { method: 'DELETE' });
                    loadData();
                } catch (error) {
                    console.error('Delete failed:', error);
                }
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleApprove = (id: number, word: string) => {
        setModalConfig({
            isOpen: true,
            title: '审核通过',
            message: `确定要将 "${word}" 标记为已审核吗？`,
            type: 'success',
            onConfirm: async () => {
                try {
                    await fetch(`http://localhost:3001/api/words/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ is_approved: true })
                    });
                    loadData();
                } catch (error) {
                    console.error('Approve failed:', error);
                }
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleCategoryChange = async (wordId: number, newCategoryId: number) => {
        try {
            await fetch(`http://localhost:3001/api/words/${wordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_id: newCategoryId })
            });
            loadData();
        } catch (error) {
            console.error('Category update failed:', error);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header with filters */}
            <div className="bg-white border-b p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">内容管理</h2>
                    <div className="text-sm text-gray-500">
                        共 {words.length} 条，已选 {selectedIds.size} 条
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="搜索单词..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">全部分类</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.display_name}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">全部状态</option>
                        <option value="approved">已审核</option>
                        <option value="pending">待审核</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                {selectedIds.size > 0 && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                        <button
                            onClick={bulkApprove}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                        >
                            <Check size={16} /> 批量审核
                        </button>
                        <button
                            onClick={bulkDelete}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                            <Trash2 size={16} /> 批量删除
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <table className="w-full bg-white rounded-lg shadow overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="w-12 px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filteredWords.length && filteredWords.length > 0}
                                        onChange={selectAll}
                                        className="w-4 h-4 rounded"
                                    />
                                </th>
                                <th className="w-16 px-4 py-3 text-left text-sm font-medium text-gray-600">图片</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">单词</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">分类</th>
                                <th className="w-24 px-4 py-3 text-left text-sm font-medium text-gray-600">日期</th>
                                <th className="w-24 px-4 py-3 text-left text-sm font-medium text-gray-600">状态</th>
                                <th className="w-32 px-4 py-3 text-left text-sm font-medium text-gray-600">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredWords.map(word => (
                                <tr key={word.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(word.id)}
                                            onChange={() => toggleSelect(word.id)}
                                            className="w-4 h-4 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        {word.image_url ? (
                                            <img
                                                src={word.image_url}
                                                alt={word.word}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <ImageIcon size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900">{word.word}</div>
                                        <div className="text-sm text-gray-500">{word.chinese}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-200 cursor-pointer"
                                            value={word.category_id}
                                            onChange={(e) => handleCategoryChange(word.id, parseInt(e.target.value))}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.display_name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {formatDate(word.created_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {word.is_approved ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                已审核
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                                                待审核
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleApprove(word.id, word.word)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                                title="审核通过"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(word.id, word.word)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="删除"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && filteredWords.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        没有找到匹配的内容
                    </div>
                )}
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};
