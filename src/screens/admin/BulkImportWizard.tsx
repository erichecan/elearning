import React, { useState, useEffect } from 'react';
import { adminApiService } from '../../services/admin-api';
import { Sparkles, Trash2, Save, RotateCw, Image as ImageIcon, Loader2, Search, Wand2, CheckCircle } from 'lucide-react';

interface BulkImportWizardProps {
    onBack: () => void;
}

interface BulkItem {
    id: string; // temp id
    word: string;
    category: string;
    chinese: string;
    phonetic: string;
    sentence: string;
    sentence_cn: string;
    imageUrl: string;
    status: 'pending' | 'generating_text' | 'generating_image' | 'done' | 'error';
    error?: string;
    isSelected: boolean;
}

type ImportMode = 'manual' | 'magic';
type ImageSource = 'ai' | 'search';

export const BulkImportWizard: React.FC<BulkImportWizardProps> = ({ onBack }) => {
    const [mode, setMode] = useState<ImportMode>('magic');
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);

    // Manual Mode State
    const [rawInput, setRawInput] = useState('');

    // Magic Mode State
    const [magicTopic, setMagicTopic] = useState('');
    const [magicCount, setMagicCount] = useState(5);

    // Common State
    const [categoryName, setCategoryName] = useState(''); // Will be set after loading
    const [categories, setCategories] = useState<{ id: number, name: string, display_name: string }[]>([]);

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await import('../../services/api').then(m => m.categoryService.getAll());
                setCategories(cats);
                if (cats.length > 0) {
                    setCategoryName(cats[0].name);
                }
            } catch (error) {
                console.error('Failed to load categories', error);
            }
        };
        loadCategories();
    }, []);
    const [imageSource, setImageSource] = useState<ImageSource>('search'); // Default to search as requested
    const [items, setItems] = useState<BulkItem[]>([]);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');

    // Default Prompts
    const [promptTemplate, setPromptTemplate] = useState('A single {word} centered, cute soft 3D toy style, smooth edges, clean pastel color palette, soft studio lighting, subtle shadow, isolated on a warm cream background, high clarity, child-friendly, minimal detail, no text, no watermark, no extra objects');

    const [imageStyle, setImageStyle] = useState('none');

    // Success Modal State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [savedCount, setSavedCount] = useState(0);

    const styles = [
        { id: 'none', name: 'Exact Match', icon: '🔍', prompt: '', query: '' },
        { id: 'flat', name: 'Flat Cute', icon: '🧩', prompt: 'flat vector art, cute minimalist illustration, simple shapes, no outlines, pastel colors, white background, educational clipart', query: 'cute flat vector illustration' },
        { id: 'cartoon', name: 'Cartoon', icon: '🎨', prompt: 'cute colorful cartoon style, simple lines', query: 'cartoon illustration' },
        { id: 'realistic', name: 'Realistic', icon: '📸', prompt: 'highly detailed realistic photography, 4k, national geographic style', query: 'real photo high quality' },
        { id: 'watercolor', name: 'Watercolor', icon: '💧', prompt: 'soft watercolor painting, artistic, pastel colors', query: 'watercolor painting' },
        { id: '3d', name: '3D Clay', icon: '🧱', prompt: 'cute 3D clay render, isometric, plasticine texture', query: '3D render clay style' },
        { id: 'sketch', name: 'Sketch', icon: '✏️', prompt: 'black and white pencil sketch, simple line drawing', query: 'black and white line drawing' },
    ];

    // Step 1: Generate Content (Magic or Parse)
    const handleNextStep = async () => {
        setIsLoading(true);
        setStep(2);
        setItems([]);
        setProgress(0);

        try {
            let initialItems: BulkItem[] = [];

            if (mode === 'manual') {
                if (!rawInput.trim()) {
                    alert('Please enter words');
                    setIsLoading(false);
                    setStep(1);
                    return;
                }
                const words = rawInput.split('\n').map(w => w.trim()).filter(w => w);
                initialItems = words.map(w => ({
                    id: Math.random().toString(36).substr(2, 9),
                    word: w,
                    category: categoryName,
                    chinese: '',
                    phonetic: '',
                    sentence: '',
                    sentence_cn: '',
                    imageUrl: '',
                    status: 'pending',
                    isSelected: true
                }));
            } else {
                // Magic Mode: Generate Text Content first
                if (!magicTopic.trim()) {
                    alert('Please enter a topic');
                    setIsLoading(false);
                    setStep(1);
                    return;
                }
                setStatusMessage(`Generating word list for "${magicTopic}"...`);

                // Call backend to generate word list
                const generatedWords = await adminApiService.generateContent(magicTopic, magicCount);

                initialItems = generatedWords.map((w: any) => ({
                    id: Math.random().toString(36).substr(2, 9),
                    word: w.word,
                    category: categoryName,
                    chinese: w.chinese,
                    phonetic: w.phonetic,
                    sentence: w.sentence_en,
                    sentence_cn: w.sentence_zh,
                    imageUrl: '',
                    status: 'pending',
                    isSelected: true
                }));
            }

            setItems(initialItems);
            // Auto-start image generation for next step
            setTimeout(() => handleGenerateImages(initialItems), 500);

        } catch (error) {
            console.error(error);
            alert('Failed to generate content');
            setIsLoading(false);
            setStep(1);
        }
    };

    // Step 2: Generate/Search Images
    const handleGenerateImages = async (currentItems: BulkItem[]) => {
        setIsLoading(true);
        let completed = 0;
        const updatedItems = [...currentItems];

        const selectedStyle = styles.find(s => s.id === imageStyle) || styles[0];
        setStatusMessage(imageSource === 'ai' ? `Generating (${selectedStyle.name})...` : `Searching (${selectedStyle.name})...`);

        for (let i = 0; i < updatedItems.length; i++) {
            updatedItems[i].status = 'generating_image';
            setItems([...updatedItems]); // Force render

            try {
                let url = '';
                if (imageSource === 'ai') {
                    // Inject style into prompt template
                    // Basic template: "A single {word} centered..."
                    // We append style prompt
                    let prompt = promptTemplate.replace('{word}', updatedItems[i].word);
                    if (selectedStyle.prompt) {
                        prompt += `, ${selectedStyle.prompt}`;
                    }

                    url = await adminApiService.generateImage(prompt, 'schnell');
                } else {
                    // Tavily Search with style query
                    // If exact match (none), just use the word
                    let query = updatedItems[i].word;
                    if (selectedStyle.query) {
                        query += ` ${selectedStyle.query}`;
                    }
                    // Only append 'white background' if not exact match, or maybe user wants it? 
                    // Let's keep 'white background' only if style is NOT none, to be truly exact.
                    if (imageStyle !== 'none') {
                        query += ` white background`;
                    }

                    url = await adminApiService.searchImage(query);
                }

                updatedItems[i].imageUrl = url;
                updatedItems[i].status = 'done';
            } catch (e) {
                console.error(e);
                updatedItems[i].status = 'error';
                updatedItems[i].error = 'Failed';
            }

            completed++;
            setProgress(Math.round((completed / updatedItems.length) * 100));
            setItems([...updatedItems]);
        }

        setIsLoading(false);
        setStep(3); // Review Step
    };


    // Individual Regenerate
    const handleRegenerateOne = async (index: number) => {
        const updatedItems = [...items];
        updatedItems[index].status = 'generating_image';
        updatedItems[index].imageUrl = ''; // clear old
        setItems([...updatedItems]);

        const selectedStyle = styles.find(s => s.id === imageStyle) || styles[0];

        try {
            let url = '';
            if (imageSource === 'ai') {
                let prompt = promptTemplate.replace('{word}', updatedItems[index].word);
                if (selectedStyle.prompt) prompt += `, ${selectedStyle.prompt}`;
                url = await adminApiService.generateImage(prompt, 'schnell');
            } else {
                let query = updatedItems[index].word;
                if (selectedStyle.query) query += ` ${selectedStyle.query}`;
                if (imageStyle !== 'none') query += ` white background`;
                url = await adminApiService.searchImage(query);
            }
            updatedItems[index].imageUrl = url;
            updatedItems[index].status = 'done';
        } catch (e) {
            updatedItems[index].status = 'error';
        }
        setItems([...updatedItems]);
    };

    // Step 3: Save
    const handleSaveAll = async () => {
        const selectedItems = items.filter(i => i.isSelected);
        if (selectedItems.length === 0) {
            alert("No items selected!");
            return;
        }

        setIsLoading(true);
        setStatusMessage(`Saving ${selectedItems.length} items to Library...`);
        let completed = 0;

        // 1. Ensure Category exists (or get ID)
        // For now, we assume categoryName is just a string, and we might create it if not exists 
        // OR we just assume it maps to an existing one. 
        // Ideally we should have a category selector. For this MVP, let's look it up or pick the first one matching 'Animals'.

        try {
            // Get Category ID logic (mocked or real)
            // Let's rely on wordService logic or adminApi to handle category?
            // Actually, wordService.create needs a category_id usually.
            // Let's hack: find category by name, if not found, use ID 1.
            const categories = await import('../../services/api').then(m => m.categoryService.getAll());
            // Fuzzy match category
            const targetCat = categories.find(c => c.name.toLowerCase().includes(categoryName.toLowerCase()) || c.display_name.toLowerCase().includes(categoryName.toLowerCase())) || categories[0];

            if (!targetCat) throw new Error('No categories found');

            const supabase = (await import('../../lib/database')).supabase;

            for (const item of selectedItems) {
                if (item.status === 'done' && item.imageUrl) {
                    try {
                        // 3. Create Word Record directly with existing URL (skip storage for now)
                        await import('../../services/api').then(m => m.wordService.create({
                            word: item.word,
                            chinese: item.chinese || item.word, // Fallback
                            phonetic: item.phonetic,
                            sentence: item.sentence,
                            sentence_cn: item.sentence_cn,
                            image_url: item.imageUrl,
                            category_id: targetCat.id
                        }));

                    } catch (err) {
                        console.error(`Failed to save ${item.word}`, err);
                    }
                }
                completed++;
                setProgress(Math.round((completed / selectedItems.length) * 100));
            }

            setSavedCount(completed);
            setShowSuccessModal(true);
            // onBack(); // Moved to modal action

        } catch (error) {
            console.error(error);
            alert('Failed to save batch.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelection = (index: number) => {
        const newItems = [...items];
        newItems[index].isSelected = !newItems[index].isSelected;
        setItems(newItems);
    };

    const selectedCount = items.filter(i => i.isSelected).length;

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-500 hover:text-gray-700">Back</button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {mode === 'magic' ? <><Wand2 className="inline mr-2 text-purple-500" />Magic Import</> : 'Bulk Import'}
                    </h1>
                </div>

                {/* Mode Toggle */}
                {step === 1 && (
                    <div className="flex bg-gray-200 p-1 rounded-lg">
                        <button
                            onClick={() => setMode('manual')}
                            className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
                        >
                            Manual List
                        </button>
                        <button
                            onClick={() => setMode('magic')}
                            className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${mode === 'magic' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'}`}
                        >
                            Magic Generate
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1. Setup</span>
                    <div className="w-8 h-1 bg-gray-300"></div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2. Process</span>
                    <div className="w-8 h-1 bg-gray-300"></div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3. Review</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

                {/* Step 1: Input & Configuration */}
                {step === 1 && (
                    <div className="p-8 flex flex-col h-full overflow-y-auto">
                        <div className="grid grid-cols-2 gap-8 h-full">
                            {/* Left Column: Input */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="font-bold text-gray-700 mb-2 block">Target Category</label>
                                    <select
                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 bg-white"
                                        value={categoryName}
                                        onChange={e => setCategoryName(e.target.value)}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.display_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {mode === 'manual' ? (
                                    <div className="flex-1 flex flex-col">
                                        <label className="font-bold text-gray-700 mb-2 block">Word List (One per line)</label>
                                        <textarea
                                            className="flex-1 border-2 border-gray-200 rounded-xl p-4 resize-none focus:outline-none focus:border-blue-500 font-mono"
                                            placeholder="dolphin&#10;whale&#10;shark..."
                                            value={rawInput}
                                            onChange={e => setRawInput(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6 p-6 bg-purple-50 rounded-xl border-2 border-purple-100">
                                        <div>
                                            <label className="font-bold text-purple-900 mb-2 block">Topic to Generate</label>
                                            <input
                                                className="w-full border-2 border-purple-200 rounded-xl p-4 text-lg focus:outline-none focus:border-purple-500"
                                                placeholder="e.g. Ocean Animals, Fruits, Solar System"
                                                value={magicTopic}
                                                onChange={e => setMagicTopic(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="font-bold text-purple-900 mb-2 block">Number of Items</label>
                                            <input
                                                type="number"
                                                className="w-full border-2 border-purple-200 rounded-xl p-4 text-lg focus:outline-none focus:border-purple-500"
                                                value={magicCount}
                                                onChange={e => setMagicCount(parseInt(e.target.value))}
                                                min={1}
                                                max={50}
                                            />
                                        </div>
                                        <div className="text-sm text-purple-700">
                                            <p>✨ Magic Mode will automatically generate:</p>
                                            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                                                <li>English Word</li>
                                                <li>Chinese Translation</li>
                                                <li>Phonetic (IPA)</li>
                                                <li>Example Sentence</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Image Settings */}
                            <div className="flex flex-col gap-6 border-l pl-8">
                                <div>
                                    <label className="font-bold text-gray-700 mb-4 block">Image Source</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setImageSource('ai')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${imageSource === 'ai' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="font-bold text-blue-900 flex items-center gap-2">
                                                <Sparkles size={18} /> AI Generation
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">Consistent 3D Toy Style (Flux)</div>
                                            <div className="text-xs text-blue-600 mt-2 font-mono">~$0.003 / image</div>
                                        </button>

                                        <button
                                            onClick={() => setImageSource('search')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${imageSource === 'search' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className="font-bold text-blue-900 flex items-center gap-2">
                                                <Search size={18} /> Web Search
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">Real or Cartoon (Tavily)</div>
                                            <div className="text-xs text-green-600 mt-2 font-mono">Free / Low Cost</div>
                                        </button>
                                    </div>
                                </div>

                                {imageSource === 'ai' && (
                                    <div>
                                        <label className="font-bold text-gray-700 mb-2 block">Prompt Template</label>
                                        <textarea
                                            className="w-full h-40 border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500"
                                            value={promptTemplate}
                                            onChange={e => setPromptTemplate(e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Use {'{word}'} as placeholder.</p>
                                    </div>
                                )}

                                <div>
                                    <label className="font-bold text-gray-700 mb-4 block">Art Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {styles.map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setImageStyle(s.id)}
                                                className={`p-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${imageStyle === s.id ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'}`}
                                            >
                                                <span>{s.icon}</span> {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleNextStep}
                                    className={`mt-auto py-4 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 ${mode === 'magic' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                >
                                    {mode === 'magic' ? <><Wand2 /> Magic Generate</> : <><Sparkles /> Start Process</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Processing */}
                {step === 2 && (
                    <div className="p-8 flex flex-col items-center justify-center h-full">
                        <div className="w-full max-w-2xl text-center">
                            <Loader2 size={64} className={`mx-auto mb-8 animate-spin ${mode === 'magic' ? 'text-purple-500' : 'text-blue-500'}`} />
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {progress < 100 ? (statusMessage || 'Processing...') : 'Done!'}
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Creating {items.length} flashcards for you...
                            </p>

                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-2 relative">
                                <div
                                    className={`h-full transition-all duration-300 ${mode === 'magic' ? 'bg-purple-500' : 'bg-blue-500'}`}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-gray-500 font-mono">{progress}% Complete</p>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`bg-white rounded-xl shadow-sm border overflow-hidden group hover:shadow-md transition-all cursor-pointer relative ${item.isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-100 opacity-60'}`}
                                        onClick={() => toggleSelection(index)}
                                    >
                                        {/* Selection Validation Badge */}
                                        <div className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 ${item.isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300'}`}>
                                            {item.isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                        </div>

                                        <div className="aspect-[4/3] bg-gray-100 relative">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ImageIcon />
                                                </div>
                                            )}

                                            {/* Loading Overlay */}
                                            {item.status === 'generating_image' && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 className="text-white animate-spin" />
                                                </div>
                                            )}

                                            {/* Hover Actions (No longer overlapping click to select, moving to corner or making selective) */}
                                            {/* Actually, let's make regenerate bubble separate from card selection click */}
                                            <div className="absolute bottom-2 right-2 flex gap-2 z-20">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRegenerateOne(index);
                                                    }}
                                                    className="p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-blue-50 text-blue-600"
                                                    title="Regenerate"
                                                >
                                                    <RotateCw size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 space-y-2">
                                            <input
                                                className="w-full font-bold text-gray-800 border-none p-0 focus:ring-0 text-center bg-transparent"
                                                value={item.word}
                                                onClick={(e) => e.stopPropagation()} // Allow editing without toggling selection
                                                onChange={(e) => {
                                                    const newItems = [...items];
                                                    newItems[index].word = e.target.value;
                                                    setItems(newItems);
                                                }}
                                            />
                                            {item.chinese && (
                                                <div className="text-center text-sm text-gray-500">{item.chinese}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-4 items-center">
                            <div className="mr-auto text-gray-500 font-medium">
                                Selected: <span className="text-blue-600 font-bold">{selectedCount}</span> / {items.length}
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg"
                            >
                                Start Over
                            </button>
                            <button
                                onClick={handleSaveAll}
                                disabled={selectedCount === 0}
                                className={`px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 ${selectedCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Save size={20} /> Save Selected ({selectedCount})
                            </button>
                        </div>
                    </div>
                )}

            </div>
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Import Complete!</h3>
                            <p className="text-gray-500 mb-8">
                                Successfully adds <span className="font-bold text-gray-800">{savedCount}</span> new flashcards to your library.
                            </p>
                            <div className="w-full flex flex-col gap-3">
                                <button
                                    onClick={onBack}
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Go to Library
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        setStep(1);
                                        setItems([]);
                                        setProgress(0);
                                    }}
                                    className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Import More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
