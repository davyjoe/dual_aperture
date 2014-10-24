class StaticPagesController < ApplicationController
  def home
    @reader = EmailDigestReader.new
  end

  def about
    @team_members = TeamMember.where(company: "Dual Aperture")
    @ciss_members = TeamMember.where(company: "CISS")
  end

  def features
  end

  def dup_home
    @reader = EmailDigestReader.new
  end

  def test_page
    @posts = BlogPost.all
  end
end
