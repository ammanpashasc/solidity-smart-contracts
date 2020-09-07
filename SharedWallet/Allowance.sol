pragma solidity ^0.5.16;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/docs-v2.x/contracts/ownership/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/docs-v2.x/contracts/math/SafeMath.sol";


contract Allowance is Ownable{
    using SafeMath for uint;
    
    mapping(address => uint) public allowance;
    
    event AllowanceChanged(address indexed _forWho, address indexed _fromWhom, uint _oldAmount, uint _newAmount);
    
    modifier ownerOrAllowed(uint _amount){
        require(isOwner() || allowance[msg.sender] >= _amount, "You are not allowed to perform this action");
        _;
    }
    
    function addAllowance(address _who, uint _amount) public onlyOwner {
        emit AllowanceChanged(_who, msg.sender, allowance[_who], _amount);
        allowance[_who] = _amount;
    }
    
    function reduceAllowance(address _who, uint _amount) internal {
        emit AllowanceChanged(_who, msg.sender, allowance[_who], allowance[_who].sub(_amount));
        allowance[_who].sub(_amount);
    }
}
