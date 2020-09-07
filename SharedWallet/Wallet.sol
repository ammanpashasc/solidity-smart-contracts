pragma solidity ^0.5.16;

import "Allowance.sol";

contract SharedWallet is Allowance{
    
    event MoneyReceived(address indexed _from, uint _amount);
    event MoneySent(address indexed _to, uint _amount);
    
    function withdrawMoney(address payable _to, uint _amount) public ownerOrAllowed(_amount)  {
        if(!isOwner()){
            reduceAllowance(_to, _amount);
        }
        emit MoneySent(_to, _amount);
        _to.transfer(_amount);
    }
    
    function currentBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    function renounceOwnership() public {
        revert("Can not renounce ownership in this contract!");
    }
    
    function () external payable {
        emit MoneyReceived(msg.sender, msg.value);
    }
}

