-- Keep the Storage bucket limit aligned with the Admin uploader.
-- 20 MiB = 20 * 1024 * 1024 bytes.
update storage.buckets
set file_size_limit = 20971520
where id = 'site-assets';
