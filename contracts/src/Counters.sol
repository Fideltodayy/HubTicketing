// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

library Counters {
    struct Counter {
        uint256 value;
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter.value;
    }

    function increment(Counter storage counter) internal {
        counter.value += 1;
    }

    function decrement(Counter storage counter) internal {
        require(counter.value > 0, "Counter: decrement overflow");
        counter.value -= 1;
    }

    function reset(Counter storage counter) internal {
        counter.value = 0;
    }
}