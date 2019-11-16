class Article < ApplicationRecord
  belongs_to :story

  enum article_type: [:blog_post, :facebook_post, :tweet]

  validates :name, presence: true
  validates :text, presence: true
  validates :article_type, presence: true
  validates :story_id, presence: true
end
