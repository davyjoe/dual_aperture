desc "Create team members"
task :create_team_members => :environment do 
  data = YAML.load_file(Rails.root + 'config/team_members.yml')
  data.each {|attributes| TeamMember.create(attributes)}
end