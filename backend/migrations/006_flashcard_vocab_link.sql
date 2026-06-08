-- A3: flashcard 与 AAC 词库同源
-- 给 flashcards 增加 vocab_id 外键，标记该闪卡已"加到词板"并关联到统一的 vocabulary_items。
-- 幂等：可与其它迁移一起重复执行。

ALTER TABLE flashcards
  ADD COLUMN IF NOT EXISTS vocab_id BIGINT REFERENCES vocabulary_items(id);

CREATE INDEX IF NOT EXISTS idx_flashcards_vocab_id ON flashcards(vocab_id);
