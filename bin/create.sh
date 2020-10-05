#!/bin/bash

printf "記事タイトルを入力してください >> "; read TITLE
printf "ファイル名を入力してください(sample.md) >> "; read FILENAME
printf "カテゴリを入力してください\n"
printf "既存のカテゴリは以下です\n\n"
ls -r content/blog/
printf "\nカテゴリ名 >> "; read DIRNAME

EXTENSION=$(echo $FILENAME | cut -f 2 -d .)

if [ $EXTENSION != "md" ]; then
  FILENAME=${FILENAME}".md"
fi;

FILEPATH="content/blog/$DIRNAME/$FILENAME"

if [ ! -d content/blog/$DIRNAME ]; then
  mkdir content/blog/$DIRNAME
fi
cp bin/template.md $FILEPATH

CURRENT_TIME=$(date +"%Y-%m-%dT%TZ")
function replaceTemplate() {
  # $1 > $2 で置き換える
  # Example: replaceTemplate @DATE $DATE
  sed -i -e "s/$1/$2/g" $FILEPATH
}

# Replace
replaceTemplate @TITLE $TITLE
replaceTemplate @DATE $CURRENT_TIME
replaceTemplate @CATEGORY $DIRNAME
\rm $FILEPATH-e

printf "$FILEPATHに記事ファイルを作成しました"
