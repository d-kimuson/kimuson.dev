#!/bin/bash

set -eu

#!/bin/bash

printf "記事タイトルを入力してください >> "; read tokens
TITLE=$(echo $tokens)
printf "記事ディレクトリ名(slug)を入力してください(sample) >> "; read ARTICLE_NAME

printf "カテゴリを入力してください\n"
printf "既存のカテゴリは以下です\n\n"
ls -r src/content/internal-article/
printf "\nカテゴリ名 >> "; read DIRNAME
FILEPATH="src/content/internal-article/$DIRNAME/$ARTICLE_NAME/index.mdx"

if [ ! -d src/content/internal-article/$DIRNAME ]; then
  mkdir src/content/internal-article/$DIRNAME
fi

mkdir src/content/internal-article/$DIRNAME/$ARTICLE_NAME

cp scripts/template/blog.md $FILEPATH

CURRENT_TIME=$(date +"%Y-%m-%dT%TZ")
function replaceTemplate() {
  # $1 > $2 で置き換える
  # Example: replaceTemplate @DATE $DATE
  sed -i -e "s/$1/$2/g" $FILEPATH
}

# Replace
replaceTemplate @TITLE "$TITLE"
replaceTemplate @DATE $CURRENT_TIME
replaceTemplate @CATEGORY $DIRNAME

if [ -e $FILEPATH-e ]; then
  \rm $FILEPATH-e
fi

printf "$FILEPATH に記事ファイルを作成しました"
