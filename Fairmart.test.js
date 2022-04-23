const Fairmart=artifacts.require('./Fairmart.sol')

//chai assertion library from truffle framework
require('chai').use(require('chai-as-promised')).should()

contract('Fairmart',([deployer, admin, buyer])=>{ // accounts for testing

  let fairmart

  before(async ()=>{
    fairmart=await Fairmart.deployed()
  })

  describe('deployment',async ()=>{

    it('has name', async ()=>{
      const name=await fairmart.name()
      assert.equal(name,'Fairmart')
    })

    //check if smart contract has address, (successful deployment)
    it('successful deployment', async ()=>{
      const addr = await fairmart.address
      
      assert.notEqual(addr,'')
      assert.notEqual(addr,undefined)
      assert.notEqual(addr,null)
      assert.notEqual(addr,0x0)
    })
    
  })

  describe('listings', async ()=>{
    let result, listing

    // create listing before test runs
    before(async ()=>{
      result=await fairmart.createListing('Rice', web3.utils.toWei('1','Ether'),{from: admin})
      listing=await fairmart.listing()
    })

    it('adds listings', async ()=>{
        // check if incremented listing count
        assert.equal(listing, 1)

        // check if listing created with correct values
        const event=result.logs[0].args
        assert.equal(event.id.toNumber(),listing.toNumber(),'correct id')
        assert.equal(event.name,'Rice','correct name')
        assert.equal(event.price, '1000000000000000000','correct price')
        assert.equal(event.owner, admin, 'correct admin')
        assert.equal(event.purchased, false,'correct purchase')

        // test fail if invalid name
        await await fairmart.createListing('',web3.utils.toWei('1','Ether'), {from: admin}).should.be.rejected;

        // test fail if invalid price
        await await fairmart.createListing('iPhone X',0,{from: admin}).should.be.rejected;
    })

    it('sells listings',async ()=>{
        let prevBalance

        prevBalance=await web3.eth.getBalance(admin)
        prevBalance=new web3.utils.BN(prevBalance)
      
        result=await fairmart.purchaseItem(listing, {from: buyer,value: web3.utils.toWei('1','Ether')})
      
        const event=result.logs[0].args
        assert.equal(event.id.toNumber(), listing.toNumber(),'correct id ')
        assert.equal(event.name,'Rice', 'correct name')
        assert.equal(event.price, '1000000000000000000','correct price')
        assert.equal(event.owner,buyer, 'correct owner')
        assert.equal(event.purchased, true,'correct purchase')
      
        // Check that admin received funds
        let newBalance
        newBalance=await web3.eth.getBalance(admin)
        newBalance=new web3.utils.BN(newBalance)
      
        let price
        price=web3.utils.toWei('1', 'Ether')
        price=new web3.utils.BN(price)
      
        const expectedBalance=prevBalance.add(price)
      
        assert.equal(newBalance.toString(),expectedBalance.toString())

        // fail if item has invalid id
        await fairmart.purchaseItem(100, { from: buyer,value: web3.utils.toWei('1','Ether')}).should.be.rejected;      
        
        // fail if not enough ether
        await fairmart.purchaseItem(listing,{from: buyer,value: web3.utils.toWei('0.4','Ether') }).should.be.rejected;

        // fail if try to purchase product twice
        await fairmart.purchaseItem(listing, {from: deployer,value: web3.utils.toWei('1','Ether')}).should.be.rejected;

        // fail if buyer tries to buy again
        await fairmart.purchaseItem(listing, {from: buyer, value: web3.utils.toWei('1','Ether')}).should.be.rejected;
      })
  })
})