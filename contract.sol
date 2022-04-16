// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Coupon {


    mapping (address => uint256) public balanceOf;


    string public name = "FairMart Coupon";
    string public symbol = "FMC";
    uint8 public decimals = 0;

    uint256 public totalSupply = 5000 * (uint256(10) ** decimals);
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    function FairMartCoupon() public {
        // Initially assign all tokens to the contract's creator.
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // more stuff to come
}

