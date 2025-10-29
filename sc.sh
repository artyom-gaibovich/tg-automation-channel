#!/bin/bash

FOLDER="apps"
TARGET_DIR="git_changes"
SUMMARY_FILE="$TARGET_DIR/changes_summary.txt"

mkdir -p "$TARGET_DIR"
mkdir -p "$TARGET_DIR/comparison"

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="unknown"
fi

echo "Сбор измененных файлов с сравнением из: $FOLDER"
echo "Текущая ветка: $CURRENT_BRANCH"

{
    echo "=== ОБЗОР ИЗМЕНЕНИЙ ==="
    echo "Папка: $FOLDER"
    echo "Ветка: $CURRENT_BRANCH"
    echo "Время: $(date)"
    echo "Коммит: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    echo "=========================================="
    echo ""
} > "$SUMMARY_FILE"

process_file() {
    local file="$1"
    local status="$2"

    local base_name=$(basename "$file")
    local old_file="$TARGET_DIR/comparison/${base_name}.old"
    local new_file="$TARGET_DIR/comparison/${base_name}.new"
    local comparison_file="$TARGET_DIR/comparison/${base_name}.comparison.txt"

    cp "$file" "$new_file"

    # Добавляем в суммарный файл
    echo "=== ФАЙЛ: $file ===" >> "$SUMMARY_FILE"
    echo "Статус: $status" >> "$SUMMARY_FILE"
    echo "---" >> "$SUMMARY_FILE"

    if git show "HEAD:$file" > "$old_file" 2>/dev/null; then
        echo "=== Сравнение файла: $file ===" > "$comparison_file"
        echo "=== Статус: $status ===" >> "$comparison_file"
        echo "=== Ветка: $CURRENT_BRANCH ===" >> "$comparison_file"
        echo "" >> "$comparison_file"

        echo "--- СТАРАЯ ВЕРСИЯ ---" >> "$comparison_file"
        cat "$old_file" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "--- НОВАЯ ВЕРСИЯ ---" >> "$comparison_file"
        cat "$new_file" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "--- DIFF ---" >> "$comparison_file"
        git diff --no-index "$old_file" "$new_file" >> "$comparison_file" 2>/dev/null || echo "Файлы идентичны или diff недоступен" >> "$comparison_file"

        # Для суммарного файла - только diff и ключевая информация
        echo "ИЗМЕНЕНИЯ:" >> "$SUMMARY_FILE"
        git diff --no-index "$old_file" "$new_file" >> "$SUMMARY_FILE" 2>/dev/null || echo "Незначительные изменения или файлы идентичны" >> "$SUMMARY_FILE"

    else
        echo "=== НОВЫЙ ФАЙЛ: $file ===" > "$comparison_file"
        echo "=== Статус: $status ===" >> "$comparison_file"
        echo "=== Ветка: $CURRENT_BRANCH ===" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "Файл не существовал в последнем коммите" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "--- СОДЕРЖИМОЕ ---" >> "$comparison_file"
        cat "$new_file" >> "$comparison_file"

        # Для суммарного файла
        echo "НОВЫЙ ФАЙЛ (полное содержимое):" >> "$SUMMARY_FILE"
        cat "$new_file" >> "$SUMMARY_FILE"
    fi

    echo "" >> "$SUMMARY_FILE"
    echo "==========================================" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"

    echo "Сравнение для $file: $comparison_file"
}

export -f process_file
export TARGET_DIR
export CURRENT_BRANCH

modified_count=0
new_count=0

temp_list=$(mktemp)

git status --porcelain -- "$FOLDER" | while read status file; do
    if [[ $status != "D" && $status != "??" ]]; then
        if [ -f "$file" ]; then
            if [[ $status == "M" ]]; then
                ((modified_count++))
            elif [[ $status == "A" || $status == "??" ]]; then
                ((new_count++))
            fi
            echo "$file $status" >> "$temp_list"
            process_file "$file" "$status"
        fi
    fi
done

# Добавляем сводку в начало файла
{
  echo "Ты — Commit Message Generator, эксперт по стандарту Conventional Commits.

Твоя задача — создать осмысленное коммит-сообщение на русском языке по предоставленным данным.

Формат вывода (строго):
  <JIRA-ID>: <Type> <Краткое описание изменения>

Правила:
  1. Извлеки идентификатор задачи из имени ветки (например, из FEATURES/DRCTV-60 возьми DRCTV-60).
  2. Преобразуй тип изменения (Fix/Feat и т.п.) в Capital Case.
  3. Проанализируй предоставленный diff и определи, что именно было изменено.
  4. Сформулируй краткое, информативное описание на русском — что реализовано или исправлено.
  5. Если изменения незначительны (например, косметические правки, рефакторинг без логики), укажи это явно.
  6. Выводи только одну строку — готовое сообщение.

Пример:
  Вход:
  Branch: FEATURES/DRCTV-60
  Type: Feat
  Diff summary: добавлено поле is_archive и логика для архивации новостей
  Вывод: DRCTV-60: Feat добавлена обработка архивации новостей

Теперь проанализируй следующие данные и выведи одно commit-сообщение:
  Branch: [вставить имя ветки]
  Type: [вставить тип изменения]
  Diff: [вставить diff и отчёт об изменениях]"

  echo "=== СВОДКА ИЗМЕНЕНИЙ ==="
  echo "Ветка: $CURRENT_BRANCH"
  echo "Папка: $FOLDER"
  echo "Всего измененных файлов: $((modified_count + new_count))"
  echo "Модифицированных: $modified_count"
  echo "Новых: $new_count"
  echo ""
  echo "=== СПИСОК ИЗМЕНЕННЫХ ФАЙЛОВ ==="
  cat "$temp_list" 2>/dev/null || echo "Файлы не найдены"
  echo ""
  echo "=== ДЕТАЛЬНЫЕ ИЗМЕНЕНИЯ ==="
  echo ""
} | cat - "$SUMMARY_FILE" > "$SUMMARY_FILE.tmp" && mv "$SUMMARY_FILE.tmp" "$SUMMARY_FILE"
rm -f "$temp_list"

echo "Готово!"
echo "Файлы сравнения в: $TARGET_DIR/comparison"
echo "Единый файл для нейросети: $SUMMARY_FILE"
echo "Ветка: $CURRENT_BRANCH"
#!/bin/bash

FOLDER="apps"
TARGET_DIR="git_changes"
SUMMARY_FILE="$TARGET_DIR/changes_summary.txt"

mkdir -p "$TARGET_DIR"
mkdir -p "$TARGET_DIR/comparison"

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="unknown"
fi

echo "Сбор измененных файлов с сравнением из: $FOLDER"
echo "Текущая ветка: $CURRENT_BRANCH"

{
    echo "=== ОБЗОР ИЗМЕНЕНИЙ ==="
    echo "Папка: $FOLDER"
    echo "Ветка: $CURRENT_BRANCH"
    echo "Время: $(date)"
    echo "Коммит: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    echo "=========================================="
    echo ""
} > "$SUMMARY_FILE"

process_file() {
    local file="$1"
    local status="$2"

    local base_name=$(basename "$file")
    local old_file="$TARGET_DIR/comparison/${base_name}.old"
    local new_file="$TARGET_DIR/comparison/${base_name}.new"
    local comparison_file="$TARGET_DIR/comparison/${base_name}.comparison.txt"

    cp "$file" "$new_file"

    # Добавляем в суммарный файл
    echo "=== ФАЙЛ: $file ===" >> "$SUMMARY_FILE"
    echo "Статус: $status" >> "$SUMMARY_FILE"
    echo "---" >> "$SUMMARY_FILE"

    if git show "HEAD:$file" > "$old_file" 2>/dev/null; then
        echo "=== Сравнение файла: $file ===" > "$comparison_file"
        echo "=== Статус: $status ===" >> "$comparison_file"
        echo "=== Ветка: $CURRENT_BRANCH ===" >> "$comparison_file"
        echo "" >> "$comparison_file"

        echo "--- СТАРАЯ ВЕРСИЯ ---" >> "$comparison_file"
        cat "$old_file" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "--- НОВАЯ ВЕРСИЯ ---" >> "$comparison_file"
        cat "$new_file" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "--- DIFF ---" >> "$comparison_file"
        git diff --no-index "$old_file" "$new_file" >> "$comparison_file" 2>/dev/null || echo "Файлы идентичны или diff недоступен" >> "$comparison_file"

        # Для суммарного файла - только diff и ключевая информация
        echo "ИЗМЕНЕНИЯ:" >> "$SUMMARY_FILE"
        git diff --no-index "$old_file" "$new_file" >> "$SUMMARY_FILE" 2>/dev/null || echo "Незначительные изменения или файлы идентичны" >> "$SUMMARY_FILE"

    else
        echo "=== НОВЫЙ ФАЙЛ: $file ===" > "$comparison_file"
        echo "=== Статус: $status ===" >> "$comparison_file"
        echo "=== Ветка: $CURRENT_BRANCH ===" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "Файл не существовал в последнем коммите" >> "$comparison_file"
        echo "" >> "$comparison_file"
        echo "--- СОДЕРЖИМОЕ ---" >> "$comparison_file"
        cat "$new_file" >> "$comparison_file"

        # Для суммарного файла
        echo "НОВЫЙ ФАЙЛ (полное содержимое):" >> "$SUMMARY_FILE"
        cat "$new_file" >> "$SUMMARY_FILE"
    fi

    echo "" >> "$SUMMARY_FILE"
    echo "==========================================" >> "$SUMMARY_FILE"
    echo "" >> "$SUMMARY_FILE"

    echo "Сравнение для $file: $comparison_file"
}

export -f process_file
export TARGET_DIR
export CURRENT_BRANCH

modified_count=0
new_count=0

temp_list=$(mktemp)

git status --porcelain -- "$FOLDER" | while read status file; do
    if [[ $status != "D" && $status != "??" ]]; then
        if [ -f "$file" ]; then
            if [[ $status == "M" ]]; then
                ((modified_count++))
            elif [[ $status == "A" || $status == "??" ]]; then
                ((new_count++))
            fi
            echo "$file $status" >> "$temp_list"
            process_file "$file" "$status"
        fi
    fi
done

# Добавляем сводку в начало файла
{
  echo "Ты — Commit Message Generator, эксперт по стандарту Conventional Commits.

Твоя задача — создать осмысленное коммит-сообщение на русском языке по предоставленным данным.

Формат вывода (строго):
  <JIRA-ID>: <Type> <Краткое описание изменения>

Правила:
  1. Извлеки идентификатор задачи из имени ветки (например, из FEATURES/DRCTV-60 возьми DRCTV-60).
  2. Преобразуй тип изменения (Fix/Feat и т.п.) в Capital Case.
  3. Проанализируй предоставленный diff и определи, что именно было изменено.
  4. Сформулируй краткое, информативное описание на русском — что реализовано или исправлено.
  5. Если изменения незначительны (например, косметические правки, рефакторинг без логики), укажи это явно.
  6. Выводи только одну строку — готовое сообщение.

Пример:
  Вход:
  Branch: FEATURES/DRCTV-60
  Type: Feat
  Diff summary: добавлено поле is_archive и логика для архивации новостей
  Вывод: DRCTV-60: Feat добавлена обработка архивации новостей

Теперь проанализируй следующие данные и выведи одно commit-сообщение:
  Branch: [вставить имя ветки]
  Type: [вставить тип изменения]
  Diff: [вставить diff и отчёт об изменениях]"

  echo "=== СВОДКА ИЗМЕНЕНИЙ ==="
  echo "Ветка: $CURRENT_BRANCH"
  echo "Папка: $FOLDER"
  echo "Всего измененных файлов: $((modified_count + new_count))"
  echo "Модифицированных: $modified_count"
  echo "Новых: $new_count"
  echo ""
  echo "=== СПИСОК ИЗМЕНЕННЫХ ФАЙЛОВ ==="
  cat "$temp_list" 2>/dev/null || echo "Файлы не найдены"
  echo ""
  echo "=== ДЕТАЛЬНЫЕ ИЗМЕНЕНИЯ ==="
  echo ""
} | cat - "$SUMMARY_FILE" > "$SUMMARY_FILE.tmp" && mv "$SUMMARY_FILE.tmp" "$SUMMARY_FILE"
rm -f "$temp_list"

echo "Готово!"
echo "Файлы сравнения в: $TARGET_DIR/comparison"
echo "Единый файл для нейросети: $SUMMARY_FILE"
echo "Ветка: $CURRENT_BRANCH"

rm -rf "$TARGET_DIR/comparison"
