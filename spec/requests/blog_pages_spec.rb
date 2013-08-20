require 'spec_helper'

describe "Blog pages" do
  
  subject { page }

  describe "index" do
    describe "blogpost creation" do
      before do
        visit blog_posts_path
        click_link "Create New Post"
      end

      describe "with invalid information" do
        it "should not create a blog post" do
          within("#new_blog_modal") do
            expect(click_button "Post").to_not change(BlogPost, :count)
          end
        end
      end

      describe "with valid information" do
        before do
          within("#new_blog_modal") do
            fill_in "blog_post_title", with: Faker::Lorem.sentence
            fill_in "blog_post_content", with: Faker::Lorem.paragraph
          end
        end

        it "should create a blog post" do
          within("#new_blog_modal") do
            expect(click_button "Post").to change(BlogPost, :count).by(1)
          end
        end
      end
    end

    # describe "pagination" do
    #   let(:first_page) { BlogPost.paginate(page: 1) }
    # end
  end  
end