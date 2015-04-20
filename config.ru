# This file is used by Rack-based servers to start the application.

#require ::File.expand_path('../config/environment',  __FILE__)
#run Rails.application

use Rack::Static,
  :urls => ["/assets"],
  :root => "public",
  :index =>'index.html'

map "/" do
  run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/index.html', File::RDONLY)
  ]
}
end

map "/about" do
  run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/about/index.html', File::RDONLY)
  ]
}
end

map "/blog_posts" do
  run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/blog_posts/index.html', File::RDONLY)
  ]
}
end

map "/faq" do
  run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/faq/index.html', File::RDONLY)
  ]
}
end

map "/press" do
  run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('public/press/index.html', File::RDONLY)
  ]
}
end
