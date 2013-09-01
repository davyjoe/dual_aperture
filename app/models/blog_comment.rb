class BlogComment < ActiveRecord::Base
  belongs_to :blog_post

  validates_presence_of :description
end
