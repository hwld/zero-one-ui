---
name: merge-renovate
description: renovate PRをrenovate-baseブランチに安全にマージする
---

# merge-renovate

renovate PRのコンフリクトを解消し、renovate-baseブランチにマージするスキル。

**重要: PRブランチ側にベースブランチをマージしてからPRブランチにpushすること。ベースブランチに直接マージ・pushしてはいけない。**

## 手順

### 1. renovate-baseへのオープンPRを一覧表示

```bash
gh pr list --base renovate-base --state open
```

### 2. ユーザーにどのPRを処理するか確認

AskUserQuestionツールを使って、一覧からどのPRを処理するかユーザーに選択してもらう。

### 3. 選択されたPRのブランチをチェックアウト

```bash
git fetch origin
git checkout <pr-branch>
git pull origin <pr-branch>
```

### 4. ベースブランチ(renovate-base)をPRブランチにマージ

```bash
git merge origin/renovate-base
```

### 5. コンフリクトが発生した場合

- **lock fileのみのコンフリクト** (`pnpm-lock.yaml`):
  1. `git checkout --theirs pnpm-lock.yaml` でlock fileを一旦解消
  2. `pnpm install` でlock fileを再生成
  3. `git add pnpm-lock.yaml`
  4. `git commit` でマージコミットを完了

- **その他のファイルのコンフリクト**:
  1. コンフリクト内容を確認
  2. 解消案をユーザーに提示して確認を取る
  3. 解消後 `git add` して `git commit`

### 6. PRブランチにpush

```bash
git push origin <pr-branch>
```

### 7. PRをマージ

```bash
gh pr merge <pr-number> --merge
```

マージ完了後、ユーザーに結果を報告する。
