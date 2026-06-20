# Image Debug Steps - News Featured Image (Staff -> Public)

## 1) Confirm DB is storing the image path

- Create a **Published** news item with an image.
- Check table `public_news` for the new row.
- Ensure `image_path` is NOT null and looks like:
    - `news/<filename>`

## 2) Confirm the file exists in storage

- On the server, verify file exists at:
    - `storage/app/public/news/<filename>`

## 3) Confirm storage symlink exists

Run:

- `php artisan storage:link`

## 4) Confirm URL used by frontend matches `storage` URL

Your public page renders:

- `<img src={article.image_path}>` (direct)

So `image_path` must already be a web-accessible URL.
But we currently store a **relative disk path** (`news/...`).

✅ Fix approach:

- Either update frontend to prepend `/storage/`:
    - `<img src={article.image_path ? `/storage/${article.image_path}` : ...}`
- Or update backend to store full public URL:
    - `image_path = Storage::disk('public')->url($path)`

## 5) Recommended immediate check

After publishing, open browser DevTools > Network:

- Inspect request for the image URL shown in the DOM.
- If it returns 404, the mismatch is almost certainly `/storage` vs raw disk path.
