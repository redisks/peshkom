# Используем официальный образ Node.js с LTS
FROM node:20-alpine AS builder

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY frontend/package*.json ./ 

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем остальные файлы приложения
COPY frontend/ .

# Собираем приложение
RUN npm run build

# Используем lighter образ для продакшена
FROM node:20-alpine AS runner

WORKDIR /app

# Создаём пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -u 1001 -S nextjs -s /bin/sh

# Копируем только необходимые файлы из builder
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/ ./.next/
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Переключаемся на пользователя nextjs
USER nextjs

# Экспорт порта
EXPOSE 3000

# Команда для запуска
CMD ["npm", "start"]