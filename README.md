# tree-sitter-wasm-c-generate-example

Tree-sitterを使用した最小限のパーサ実装例。「C-F-G-C」を「1,4,5,1」に変換する。

## 構成

このプロジェクトは、Tree-sitterを使用して音符（C, D, E, F, G, A, B）をパースし、数値に変換する最小限のパーサを実装しています。

### ディレクトリ構造

```
grammar/
  └── grammar.js        # Tree-sitter文法定義（MUST USE）
src/
  └── parser.c          # 生成されたCパーサ
dist/
  └── parser.wasm       # 生成されたWASMパーサ
```

## 文法定義

`grammar/grammar.js` でTree-sitter文法を定義しています：

- `source_file`: エントリーポイント
- `note_sequence`: ハイフンで区切られた音符のシーケンス
- `note`: 個別の音符 (C, D, E, F, G, A, B)

## ビルド方法

```bash
# 依存関係のインストール
npm install

# パーサの生成とビルド
npm run build
```

これにより、以下が生成されます：
- `src/parser.c` - C言語版パーサ
- `dist/parser.wasm` - WASM版パーサ

## 使用例

### デモアプリケーションの実行

```bash
# WASMパーサを使用した変換デモ
npm test
```

出力例：
```
=== Tree-sitter Musical Notes Converter (WASM) ===

Input: C-F-G-C

Parse Tree (generated from grammar/grammar.js):
(source_file (note_sequence (note) (note) (note) (note)))

Extracted Notes: [ 'C', 'F', 'G', 'C' ]
Converted Numbers: [ 1, 4, 5, 1 ]

Output: 1,4,5,1

✓ Success: Output matches expected result
```

### CLI経由でのテスト

```bash
# test.notesファイルをパース
npx tree-sitter parse test.notes
```

入力 `C-F-G-C` の解析結果:
```
(source_file
  (note_sequence
    (note)  # C
    (note)  # F
    (note)  # G
    (note)  # C
  ))
```

### 音符から数値への変換

パースツリーから音符を抽出し、以下のマッピングで数値に変換します：

```
C → 1
D → 2
E → 3
F → 4
G → 5
A → 6
B → 7
```

例: `C-F-G-C` → `[C, F, G, C]` → `[1, 4, 5, 1]` → `1,4,5,1`

## Tree-sitterの利点

このアーキテクチャにより以下が可能です：

1. **スケーラビリティ**: 文法を拡張して、オクターブ、音価、コードなどをサポート可能
2. **多言語サポート**: 同じ文法からC、Rust、JavaScript、Python等の言語用パーサを生成可能
3. **高性能**: インクリメンタルパーシングとエラーリカバリーをサポート
4. **標準化**: Tree-sitter エコシステムの恩恵を受けられる

## 重要な設計ポイント

- **grammar.js の使用が必須**: すべてのパーサは `grammar/grammar.js` から生成されています
- **Tree-sitter の必然性**: 手動実装ではなく、Tree-sitter の文法定義システムを活用
- **スケーラブルな土台**: 将来の拡張を見据えた設計

## ライセンス

See LICENSE file.