# 
# To change this template, choose Tools | Templates
# and open the template in the editor.


class Dog   
  
  def initialize(breed, name)    
    @breed = breed
    @name = name
  end
  
  def bark
    puts 'Ruff! Ruff!'
  end
  
  def display
    puts "Jestem #{@breed} i moje imie to #{@name}."
  end  
  
  def name=(nm)
    @name = nm
  end
  
end

# make an object
# method new used to create object
#puts Dog.methods.sort
duffi = Dog.new('owczarek', 'duffi')
puts duffi.class.to_s

# contd. From previous page
# puts duffi.methods.sort

puts "Czy 'duffi' jest psem ? : #{duffi.instance_of? Dog}"

puts "Id obiektu duffi to: #{duffi.object_id}."
if duffi.respond_to?("talk")
  duffi.talk
else
  puts "Przepraszamy, ale 'duffi' nie potrafi mowic, poniewaz jest psem."
end
duffi.bark
duffi.display
d1 = duffi
d1.display

# define class Dog
class Dog
  def big_bark
    puts 'Woof! Woof!'
  end
end

#Nothing stops you from defining a method
#twice, however the new version takes precedence.
duffi.big_bark

duffi.name = "reksio"
duffi.display

duffi = nil
duffi.display

# that are intended for a subclass to implement is abstract
class AbstractDog
  def welcome
    puts "#{hello} #{name}"
  end
end
# A concrete class
class ConcreteDog < AbstractDog
  def hello; "Witam"; end
  def name; "wszystkich"; end
end

ConcreteDog.new.welcome


# The Rectangle initialize accepts arguments in either
# of the following forms:
# Rectangle.new([x_top, y_left], length, width)
# Rectangle.new([x_top, y_left], [x_bottom, y_right])
class Rectangle
  def initialize(*args)
    if args.size < 2 || args.size > 3
      # modify this to raise exception, later
      puts 'This method takes either 2 or 3 arguments'
    else
      
    if args.size == 2
      puts 'Two arguments'
    else
      puts 'Three arguments'
    end
   end
  end
end
Rectangle.new([10, 23], 4, 10)
Rectangle.new([10, 23], [14, 13])


def some_mtd some_proc
puts 'Start of mtd'
some_proc.call
puts 'End of mtd'
end
say = lambda do
puts 'Hello'
end
some_mtd say









