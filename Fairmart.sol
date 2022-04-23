pragma solidity >=0.4.21 <0.6.0;

contract Fairmart {

    mapping(uint=>Listing) public listings; //store items on blockchain
    uint public listing=0; //listing count
    string public name;

    constructor() public {
        name="FairMart";
    }

    struct Listing {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    function createListing(string memory name,uint price) public {
        require(bytes(name).length>0);
        require(price>0);
        listing++; //increase count, to be used as listing id

        listings[listing] = Listing(listing,name,price,msg.sender, false); //create new listing
    }

    function purchaseItem(uint id) public payable {
        Listing memory item=listings[id]; //fetch listing
        address payable admin=item.owner;
        //fetch owner
        require(item.id<=listing && item.id>0); //valid item id
        require(msg.value>=item.price); //enough ether
        require(!item.purchased); //item not purchased yet
        require(admin!=msg.sender); //buyer cannot be the admin (who listed the product)

        item.owner=msg.sender; //transfer ownership

        item.purchased=true;
        listings[id]=item;

        address(admin).transfer(msg.value); //pay admin
    }
}