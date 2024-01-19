FROM mcr.microsoft.com/playwright:v1.41.0

WORKDIR /app

COPY . .

RUN npm install && npm install @playwright/test
RUN npm run build

CMD npx playwright test