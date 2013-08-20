class BlogPostsController < ApplicationController

  def index
    @posts = BlogPost.all
  end

  def show
  end

  def create
    @post = BlogPost.create(blog_params)
    redirect_to blog_posts_path
  end

  def update
  end

  def edit
  end

  def destroy
  end

  private

  def blog_params
    params.require(:blog_post).permit(:title, :description)
  end
end
