const {sequelize} = require('./db')
const {Restaurant, Menu} = require('./models/index')
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
