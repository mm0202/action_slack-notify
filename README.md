![test](https://github.com/mm0202/action_slack-notify/workflows/test/badge.svg?branch=master)
![notification-check](https://github.com/mm0202/action_slack-notify/workflows/notification-check/badge.svg?branch=master)

# action_slack-notify
 Slackへのワークフロー結果通知アクション

## Usage Samples
### Default Style
```yml
- uses: mm0202/action_slack-notify@master
  if: always()
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
[![Image from Gyazo](https://i.gyazo.com/2f672a6cede007f022129c6e5d375d25.png)](https://gyazo.com/2f672a6cede007f022129c6e5d375d25)

デフォルトスタイル。リポジトリや実行されたワークフローへのリンクなどを表示。

### Variables Check Style
```yml
- uses: mm0202/action_slack-notify@master
  if: always()
  with:
    style: "variables-check"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
コード中で使用可能な変数の確認用スタイル。アクション開発時の確認用。

### Custom Payload / merge payload & prepend attachments
```yml
- uses: mm0202/action_slack-notify@master
  if: always()
  with:
    payload: |
      {
        "text": "${{ job.status }}:bangbang:",
        "attachments": [{
          "fields": [{
            "title": "Repository",
            "value": "${{ github.repository }}"
          }]
        }]
      }
    customPayloadMode: "merge"
    customAttachmentMode: "prepend"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
[![Image from Gyazo](https://i.gyazo.com/e6ff051d21a7cd1e6dd82737fae4dc18.png)](https://gyazo.com/e6ff051d21a7cd1e6dd82737fae4dc18)

#### `customPayloadMode: "merge"`
`payload`に指定の無い項目は、スタイルの設定を適用。

#### `customAttachmentMode: "prepend"`
`attachments`で指定の内容は、スタイルのattachmentの前に追加。

### Custom Payload / overwrite payload
```yml
- uses: mm0202/action_slack-notify@master
  if: always()
  with:
    payload: |
      {
        "text": "${{ job.status }}:bangbang:",
        "attachments": [{
          "fields": [{
            "title": "Ref",
            "value": "${{ github.ref }}"
          }]
        }]
      }
    customPayloadMode: "overwrite"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```
[![Image from Gyazo](https://i.gyazo.com/d2136f17c0982c4a979e8de69746b053.png)](https://gyazo.com/d2136f17c0982c4a979e8de69746b053)

#### `customPayloadMode: "overwrite"`
`payload`の指定で上書き。スタイルの設定は無視。

## Contexts
`payload`の設定で使用可能な変数は以下を参照してください。

[Context and expression syntax for GitHub Actions](https://help.github.com/ja/actions/reference/context-and-expression-syntax-for-github-actions)

## inputs
### style
| value | default | description
| - | - | -
| default | o | [Default Style](#Default-Style)を参照
| variables-check | - | [Variables Check Style](Variables-Check-Style)を参照

### payload
カスタムpayload。デフォルトは`"{}"`。

### customPayloadMode
| value | default | description
| - | - | -
| merge | o | スタイルのpayloadとマージ
| overwrite | - | スタイルのpayloadを上書き

### customAttachmentMode
| value | default | description
| - | - | -
| append | o | スタイルのattachmentの後に追加
| prepend | - | スタイルのattachmentの前の追加
| overwrite | - | スタイルのattachmentsを上書き

### status
デフォルトは`job.status`の値を使用。特別な場合を除き、ワークフローでの設定は必要なし。

## outputs
### result
アクションの結果