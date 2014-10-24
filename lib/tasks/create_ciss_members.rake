desc "Create CISS members"
task :create_ciss_members => :environment do 
  data = YAML.load_file(Rails.root + 'config/ciss_members.yml')
  data.each do |attributes| 
    member = TeamMember.new(attributes)
    member.picture = File.open(File.join(Rails.root, 'app', 'assets', 'images', attributes['picture']))
    member.save
  end
end