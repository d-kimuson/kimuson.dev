カレントブランチのプルリクエストを作成してください。

## Process

1. **変更内容の把握**
   - `./scripts/get_base_branch.sh` でカレントブランチへの移動履歴からベースブランチを特定
   - カレントブランチ <-> ベースブランチ間の差分を確認する
   - 現在コミットされていない差分を確認する
   - 作業の流れで依頼され変更内容を把握している場合、このステップはスキップしてOK
2. **コミットする**
   - コミットされていない差分が存在する場合、分かりやすい粒度でコミットを積んでください
   - コミットされていない差分がしなければスキップして OK
3. **プッシュする**
   - カレントブランチのコミットを push してください
   - `git push -u origin HEAD`
4. **プルリクエストを作成**
   - gh コマンドを用いてプルリクエストを作成してください。
   - base ブランチを1で確認したブランチに指定してください。
