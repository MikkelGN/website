import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // start every test as a fresh child: Danish, sound off, no stars
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.clear()
      localStorage.setItem('migini-settings', JSON.stringify({ state: { soundOn: false, lang: 'da' }, version: 0 }))
      sessionStorage.setItem('seeded', '1')
    }
  })
})

test('home shows Kapi and Bao and opens the kitchen', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('img', { name: 'Kapi' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Bao' })).toBeVisible()
  await page.getByRole('button', { name: /Køkkenet/ }).click()
  await expect(page).toHaveURL(/\/koekken$/)
  await expect(page.getByText('Hvad skal vi lave?')).toBeVisible()
})

test('cook pancakes from order to a star', async ({ page }) => {
  await page.goto('/koekken')
  await expect(page.getByTestId('star-count')).toHaveText(/0/)

  await page.getByRole('button', { name: /Pandekager/ }).click()
  await expect(page.getByTestId('speech')).toContainText('Bao er sulten')
  await page.getByRole('button', { name: 'Ja, lad os lave mad!' }).click()

  // a wrong ingredient is rejected without filling a slot
  const wrong = page.getByRole('button', { name: /^(Tomat|Ost|Svampe|Banan|Jordbær|Blåbær|Gulerod|Kartoffel|Løg|Broccoli|Chokolade|Salathoved|Agurk|Majs|Appelsin|Honning|Æble|Pizzabund)$/ }).first()
  await wrong.click()
  await expect(page.locator('svg[data-mood="no"]')).toBeVisible()
  await expect(page.locator('[data-filled="true"]')).toHaveCount(0)

  for (const name of ['Æg', 'Mælk', 'Mel']) {
    await page.getByRole('button', { name, exact: true }).click()
  }
  // the last one is dragged into the bowl instead of tapped
  await page.getByRole('button', { name: 'Smør', exact: true }).dragTo(page.getByTestId('bowl'))
  await expect(page.locator('[data-filled="true"]')).toHaveCount(4)

  const mixer = page.getByTestId('mixer')
  await expect(mixer).toBeVisible()
  for (let i = 0; i < 8; i++) await mixer.click()

  const appliance = page.getByTestId('appliance')
  await expect(appliance).toHaveAttribute('data-phase', 'ready')
  await appliance.click()
  await expect(appliance).toHaveAttribute('data-phase', 'done', { timeout: 8000 })
  await page.getByRole('button', { name: 'Tag maden ud' }).last().click()

  await page.getByTestId('plate').click()
  await expect(page.getByText('Du fik en stjerne!')).toBeVisible()
  await expect(page.getByTestId('star-count')).toHaveText(/1/)

  // progress survives a reload
  await page.reload()
  await expect(page.getByTestId('star-count')).toHaveText(/1/)
})

test('smoothie skips the cooking step', async ({ page }) => {
  await page.goto('/koekken')
  await page.getByRole('button', { name: /Smoothie/ }).click()
  await page.getByRole('button', { name: 'Ja, lad os lave mad!' }).click()
  for (const name of ['Banan', 'Jordbær', 'Blåbær', 'Mælk']) {
    await page.getByRole('button', { name, exact: true }).click()
  }
  const mixer = page.getByTestId('mixer')
  for (let i = 0; i < 8; i++) await mixer.click()
  await expect(page.getByTestId('plate')).toBeVisible()
  await expect(page.getByTestId('appliance')).toHaveCount(0)
})
