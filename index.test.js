const {sequelize} = require('./db')
const {Restaurant, Menu} = require('./models/index')
const {Item} = require('./models/Item')
const {
    seedRestaurant,
    seedMenu,
  } = require('./seedData');


//adding seed data to resturant and menu:


describe('Restaurant and Menu Models', () => {

 
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
        await Restaurant.bulkCreate(seedRestaurant)
        await Menu.bulkCreate(seedMenu)

        console.log(await Menu.findAll())
    });

//---------------------Tests for Item Start--------------------------
// Make sure to export the model and import it anywhere you need it.
// Create tests to verify you can perform CRUD operations using the Item model.


    test('can create an Item', async () => {
        // TODO - write test
        const burger = await Item.create({
            name: 'burger',
            image: 'burger-image.jpg',
            price: 7.99,
            vegetarian: false,
        })
        expect(burger.name).toEqual('burger')
        expect(burger.image).toEqual('burger-image.jpg')
        expect(burger.price).toBe(7.99)
        expect(burger.vegetarian).toBe(false)
    });
    
    test('can read an Item', async () => {
        // TODO - write test
        const burger = await Item.findOne({where:{name:'burger'}})

        expect(burger.name).toEqual('burger')

    });

    test('can delete an Item', async () => {
        // TODO - write test
        const burger = await Item.findOne({where:{name:'burger'}})

        burger.destroy()

        const burgerAfterDeletion = await Item.findOne({where:{name:'burger'}})

        expect(burgerAfterDeletion).toBeNull()
    });

    test('can update an Item', async () => {
        // TODO - write test
        const burger = await Item.create({
            name: 'burger',
            image: 'burger-image.jpg',
            price: 7.99,
            vegetarian: false,
        })

        await burger.update({name:"cheese burger"})

        const updatedBurger = await Item.findOne({where:{name:"cheese burger"}})

        expect(burger.name).toEqual('cheese burger')

    });


    test('Item and Menu association', async () => {
        // TODO - write test

        //get existing menu
        //create 2 menu items
        //add 2 items to menu
        //get eager loaded data to confirm association

        const menu = await Menu.findOne({where:{title:"Dinner"}})
        const burger = await Item.findOne({where:{name:'cheese burger'}})
        const soda = await Item.create({
            name: 'coke',
            image: 'coke-image.jpg',
            price: 1.99,
            vegetarian: true,
        })

        await menu.addItem(burger)
        await menu.addItem(soda)

        //get eager loaded result

        const menuWithItems = await Menu.findOne({where:{title:"Dinner"}, include:Item})

    
        expect(menuWithItems.title).toBe('Dinner')
        expect(menuWithItems.Items.length).toBe(2)
        expect(menuWithItems.Items[0].name).toEqual('cheese burger')
        expect(menuWithItems.Items[1].name).toEqual('coke')


    });




//---------------------Tests for Item End--------------------------

    test('Restaurant and Menu associations', async () => {
        // TODO - write test

        //get existing restaurant
        const spiceGrill = await Restaurant.findOne({where:{name:'Spice Grill'}})

        const menu1 = await Menu.findOne({where:{title:'Breakfast'}})
        const menu2 = await Menu.findOne({where:{title:'Dinner'}})

        //add menu instances to restaurant

        await spiceGrill.addMenu(menu1)
        await spiceGrill.addMenu(menu2)
        //load eager data

        const restaurantWithMenus = await Restaurant.findOne({where:{name:"Spice Grill"}, include:Menu})

        expect(restaurantWithMenus.name).toEqual('Spice Grill')
        expect(restaurantWithMenus.Menus.length).toBe(2);  // There should be two menus
        expect(restaurantWithMenus.Menus[0].title).toEqual('Breakfast');
        expect(restaurantWithMenus.Menus[1].title).toEqual('Dinner');        

    });

    test('can create a Restaurant', async () => {
        // TODO - write test
        let subway = await Restaurant.create({
            name:"Subway",
            location:"New York",
            cuisine:"Sub sandwich"
        })
        expect(subway.name).toEqual('Subway')
        expect(subway.location).toEqual('New York')
        expect(subway.cuisine).toEqual('Sub sandwich')
    });

    test('can create a Menu', async () => {
        // TODO - write test
        let subMenu = await Menu.create({
            title:'bbq subs'
        })
        expect(subMenu.title).toEqual('bbq subs')
    });

    test('can find Restaurants', async () => {
        // TODO - write test
         await Restaurant.create({
            name:"McDonalds",
            location:"New York",
            cuisine:"burgers"
        })

        const mickeyD = await Restaurant.findOne({where: {name:'McDonalds'}})

        expect(mickeyD).toBeDefined()
        expect(mickeyD.name).toBe('McDonalds')
    });

    test('can update Restaurants', async () => {
        // TODO - write test

        //CHECK ALL tables 
        console.log(await Restaurant.findAll())

        let mickeyD = await Restaurant.findOne({where:{name:"McDonalds"}})

        await mickeyD.update({ name: "Burger King" });

        //CHECK ALL tables make sure mcdonalds is updated to burger king
        console.log(await Restaurant.findAll())
        
        expect(mickeyD).toBeDefined();  // Ensure the restaurant exists
        expect(mickeyD.name).toEqual("Burger King");  // Check the updated name
    });

    test('can find Menus', async () => {
        // TODO - write test
        let menu = await Menu.findOne({where: {title:'bbq subs'}})
        expect(menu.title).toEqual('bbq subs')
    });

    test('can update menu', async ()=>{
        let menu = await Menu.findOne({where: {title:'Lunch'}})
        let updatedMenu = await menu.update({title:'Brunch'}, {where:{title:'Lunch'}})
        expect(updatedMenu.title).toBe('Brunch')
    })

    test('can delete Restaurants', async () => {
        // TODO - write test

        //find burgerKing
        const appleBees = await Restaurant.findOne({where:{name:'AppleBees'}})

        //destroy burger king
        await appleBees.destroy()

        //burger king is destroyed, so i cant use the instance to test
        //use new variable and search for burgerking
        const restaurantAfterDelete = await Restaurant.findOne({ where: { name: 'AppleBees' } });

        //use new variable which searched for burger king, since its not in the database it should be null
        expect(restaurantAfterDelete).toBeNull()
    });
})
