namespace :maps do  
  desc('Creating map from files')
  task(:map_create => :environment) do     
    x = 0
    y = 0
    terrain_array = []
    
#    Map.delete_all#debug
    
    map = Map.create
    
#    MapTerrainPosition.delete_all #debug
    
    Dir.chdir(Dir.pwd + "/Public/maps/")    
    file = File.new("ewa_map.txt")
    name = file.gets.chomp
    size_x = file.gets.to_i
    size_y = file.gets.to_i
    file.each_line do |line|      
      x = 0
      terrain_array = line.split(" ")
      terrain_array.each do |c|                                      
          puts "[#{y},#{x}] #{c}"          
          terrain_pos = MapTerrainPosition.create 
          terrain_pos.x = x
          terrain_pos.y = y
          terrain_pos.terrain = Terrain.find_by_short_name(c)
          map.map_terrain_positions << terrain_pos  
          terrain_pos.save!
          x = x + 1 
      end     
      y = y + 1
    end
    
    map.name =  name +'next2'
    map.size_x = size_x
    map.size_y = size_y
    map.save!
    file.close
  end  
end