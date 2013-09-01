class BlogPost < ActiveRecord::Base
  has_many :blog_comments

  validates_presence_of :title, :description
end
