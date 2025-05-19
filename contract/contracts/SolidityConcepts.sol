// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SolidityConcepts {
    uint256 public constant FIXED_VALUE = 100;
    address public immutable owner = msg.sender;
    uint256 public value = 50;
    event ValueChanged(uint256 oldValue, uint256 newValue);

    function checkValue(uint256 _value) public pure returns (string memory) {
        if (_value > 100) {
            return "Value is greater than 100";
        } else if (_value == 100) {
            return "Value is exactly 100";
        } else {
            return "Value is less than 100";
        }
    }
    function sumUpTo(uint256 _num) public pure returns (uint256) {
        uint sum;
        for (uint i = 1; i <= _num; i++) {
            sum += i;
        }
        return sum;
    }

    function updateValue(uint _newValue) public {
        uint oldValue = value;
        value = _newValue;
        emit ValueChanged(oldValue, value);
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    function ownerFunction() public view onlyOwner returns (string memory) {
        return "Hello, Owner!";
    }

    receive() external payable {}

    function sendEther(address recepient) public payable {
        require(msg.value > 0, "Must send ether");
        (bool success, ) = recepient.call{value: msg.value}("");
    }

    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withDraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }
}
