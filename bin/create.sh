#!/bin/bash

printf "記事タイトルを入力してください >> "; read TITLE
printf "記事ディレクトリ名(slug)を入力してください(sample) >> "; read ARTICLE_NAME

if [ "$1" = "article" ]; then
  printf "カテゴリを入力してください\n"
  printf "既存のカテゴリは以下です\n\n"
  ls -r content/blog/
  printf "\nカテゴリ名 >> "; read DIRNAME
  FILEPATH="content/blog/$DIRNAME/$ARTICLE_NAME/index.mdx"

  if [ ! -d content/blog/$DIRNAME ]; then
    mkdir content/blog/$DIRNAME
  fi

  mkdir content/blog/$DIRNAME/$ARTICLE_NAME

  cp bin/template/blog.md $FILEPATH
else
  FILEPATH="content/work/$ARTICLE_NAME/index.mdx"
  mkdir content/work/$ARTICLE_NAME

  cp bin/template/work.md $FILEPATH
fi

CURRENT_TIME=$(date +"%Y-%m-%dT%TZ")
function replaceTemplate() {
  # $1 > $2 で置き換える
  # Example: replaceTemplate @DATE $DATE
  sed -i -e "s/$1/$2/g" $FILEPATH
}

# Replace
replaceTemplate @TITLE $TITLE
replaceTemplate @DATE $CURRENT_TIME
if [ "$1" != "article" ]; then
  replaceTemplate @CATEGORY $DIRNAME
fi
\rm $FILEPATH-e

printf "$FILEPATH に記事ファイルを作成しました"
