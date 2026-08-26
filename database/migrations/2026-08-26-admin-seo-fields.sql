ALTER TABLE pages
  ADD COLUMN seo_title VARCHAR(180) NULL AFTER image_url,
  ADD COLUMN seo_description VARCHAR(255) NULL AFTER seo_title,
  ADD COLUMN og_image_url VARCHAR(255) NULL AFTER seo_description;

ALTER TABLE services
  ADD COLUMN seo_title VARCHAR(180) NULL AFTER image_url,
  ADD COLUMN seo_description VARCHAR(255) NULL AFTER seo_title,
  ADD COLUMN og_image_url VARCHAR(255) NULL AFTER seo_description;

ALTER TABLE portfolio_projects
  ADD COLUMN seo_title VARCHAR(180) NULL AFTER cover_image_url,
  ADD COLUMN seo_description VARCHAR(255) NULL AFTER seo_title,
  ADD COLUMN og_image_url VARCHAR(255) NULL AFTER seo_description;
