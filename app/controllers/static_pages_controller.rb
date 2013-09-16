class StaticPagesController < ApplicationController
  def home
    @reader = EmailDigestReader.new
  end

  def about
    @map = GoogleStaticMap.new(zoom: 10, width: 600)
    @map.markers << MapMarker.new(color: "blue", location: MapLocation.new(address: "890 Robb Rd, Palo Alto, CA 94306"))
  end

  def features
  end

  private 
  
  def static_map_for(location, options = {})
    params = {
      :center => [location.lat, location.lng].join(","),
      :zoom => 15,
      :size => "300x300",
      :markers => [location.lat, location.lng].join(","),
      :sensor => true
      }.merge(options)
 
    query_string =  params.map{|k,v| "#{k}=#{v}"}.join("&")
    image_tag "http://maps.googleapis.com/maps/api/staticmap?#{query_string}", :alt => location.name
  end
end
