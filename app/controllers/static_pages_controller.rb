class StaticPagesController < ApplicationController
  def home
    @reader = EmailDigestReader.new
  end

  def about
  end

  def features
  end
end
