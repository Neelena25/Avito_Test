import { test, expect } from '@playwright/test';

const baseUrl = 'https://makarovartem.github.io/frontend-avito-tech-test-assignment/';
const cardSelector = 'li.ant-list-item div.ant-card';

test('Открытие карточки игры', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForSelector(cardSelector);
  await page.locator(cardSelector).first().click();
  await expect(page.locator('h1')).toBeVisible(); // Проверка заголовка
});

test('Отображение не более 12 карточек на странице', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForSelector(cardSelector);
  const cardsCount = await page.locator(cardSelector).count();
  expect(cardsCount).toBeLessThanOrEqual(12);
});

test('Переход на вторую страницу пагинации', async ({ page }) => {
  await page.goto(baseUrl);
  await page.waitForSelector(cardSelector);

  const titlesOnFirstPage = await page.$$eval(`${cardSelector} ._title_vlg32_45`, cards =>
    cards.map(card => card.textContent?.trim())
  );

  const secondPageButton = page.locator('li.ant-pagination-item-2').first();
  await secondPageButton.waitFor({ state: 'visible' });
  await secondPageButton.click();

  await page.waitForFunction(
    (titles) => {
      const currentTitles = Array.from(document.querySelectorAll('li.ant-list-item div.ant-card ._title_vlg32_45'))
        .map(el => el.textContent.trim());
      return currentTitles.length > 0 && currentTitles.toString() !== titles.toString();
    },
    titlesOnFirstPage
  );

  const titlesOnSecondPage = await page.$$eval(`${cardSelector} ._title_vlg32_45`, cards =>
    cards.map(card => card.textContent?.trim())
  );

  expect(titlesOnSecondPage).not.toEqual(titlesOnFirstPage);
});