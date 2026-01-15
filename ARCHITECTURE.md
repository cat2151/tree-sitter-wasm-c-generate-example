# Tree-sitter アーキテクチャ設計文書

## なぜ Tree-sitter を使うのか

このプロジェクトは **意図的に** Tree-sitter を使用しています。単純な文字列処理で実現できる機能ですが、以下の理由により Tree-sitter を採用しました：

### 1. スケーラビリティの確保

現在は `C-F-G-C` という単純な入力を処理していますが、将来的に以下の拡張が容易に可能：

```
// 現在
C-F-G-C  → 1,4,5,1

// 将来の拡張例
C4-F4-G4-C5     // オクターブ指定
C/4-F/4-G/4-C/4 // 音価指定
[C,E,G]-F-G-C   // 和音
C#-F-G-Bb       // シャープ・フラット
```

これらの拡張は `grammar/grammar.js` を編集するだけで実現可能です。

### 2. パーサの自動生成

`grammar/grammar.js` から自動生成されるもの：

```
grammar/grammar.js
    ↓ tree-sitter generate
src/parser.c          (C言語版)
    ↓ tree-sitter build --wasm
dist/parser.wasm      (WASM版)
    ↓ 将来的に
parser.rs             (Rust版)
parser.py             (Python版)
...
```

### 3. パーステリー構造の活用

Tree-sitter は構造化されたパーステリーを提供：

```javascript
(source_file
  (note_sequence
    (note)  // "C"
    (note)  // "F"
    (note)  // "G"
    (note)  // "C"
  ))
```

この構造により：
- エラー検出が容易
- インクリメンタルパーシング
- シンタックスハイライト
- コード補完

### 4. エラーハンドリング

Tree-sitter は堅牢なエラーリカバリーを提供：

```
入力: C-X-G-C  (Xは無効な音符)
      ↓
Tree-sitter は ERROR ノードを作成し、パース継続
      ↓
部分的に正しい部分を活用可能
```

### 5. エコシステムの活用

Tree-sitter は以下で使用されている実績のある技術：
- GitHub (コード検索)
- Neovim (シンタックスハイライト)
- Atom/Pulsar
- Emacs (tree-sitter mode)

## 設計原則

### 必須の制約

1. **grammar.js の使用**: すべてのパーサは `grammar/grammar.js` から生成
2. **手動実装の禁止**: 簡単でも Tree-sitter を使用
3. **スケーラビリティ重視**: 将来の拡張を常に考慮

### ファイル配置

```
grammar/
  grammar.js    ← 唯一の真実の源（Single Source of Truth）

src/
  parser.c      ← grammar.js から生成（手動編集禁止）

dist/
  parser.wasm   ← grammar.js から生成（手動編集禁止）
```

## 実装の検証

### コマンドで検証

```bash
# 1. grammar.js からパーサを生成
npm run generate

# 2. WASM パーサをビルド
npm run build-wasm

# 3. 変換テスト
npm test
# 出力: 1,4,5,1
```

### Tree-sitter を使っていることの証明

```bash
# grammar.js を編集して確認
# 例: 'H' を音符に追加
# → parser.c が自動更新される
# → 新しい音符が認識される

# これにより、grammar.js が真の定義源であることが証明される
```

## まとめ

このプロジェクトは **デモではなく、設計の手本** です：

1. ✅ Tree-sitter の必然性を示している
2. ✅ スケーラブルな土台を提供
3. ✅ grammar.js が唯一の真実の源
4. ✅ 将来の拡張に対応可能

**重要**: 単純な実装を避け、意図的に適切なツールを使用することで、長期的なメンテナンス性とスケーラビリティを確保しています。
