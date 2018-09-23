App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        // Load pets.
        $.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].duration);
                petTemplate.find('.pet-age').text(data[i].date);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3: function () {
        if (typeof web3 !== 'undefined') {
            // First, we check if there's a web3 instance already active.
            // Ethereum browsers like Mist or Chrome with the MetaMask extension
            // will inject their own web3 instances.
            // If an injected web3 instance is present,
            // we get its provider and use it to create our web3 object.
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is present,
            // we set Portis as the web3 provider
            web3 = new Web3(new window.Portis.PortisProvider({ network: 'rinkeby', apiKey: '231af09a046f17c069641332d20ccef4' }));
            App.web3Provider = web3.currentProvider;
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('AttendEnsure.json', function (data) {
            // create contract interface using json data
            App.contracts.Adoption = TruffleContract(data);

            // set contract provider
            App.contracts.Adoption.setProvider(App.web3Provider);

            // mark adopted pet
            return App.markAdopted();
        });

        // update adoption status every 5 seconds
        setInterval(App.markAdopted, 5000);

        // bind events to controls
        return App.bindEvents();
    },
    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },


    handleAdopt: function () {
        event.preventDefault();

        var button = $(this);
        var petId = parseInt($(event.target).data('id'));

        // disable button during process
        button.text('Processing..').attr('disabled', true);

        var contractAddress = '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a'
        var contractABI = [
        {
        "constant": false,
        "inputs": [
        {
            "name": "_eventName",
            "type": "string"
        },
        {
            "name": "_min_deposit",
            "type": "uint256"
        },
        {
            "name": "_start_time",
            "type": "uint256"
        },
        {
            "name": "_end_time",
            "type": "uint256"
        }
        ],
        "name": "createEvent",
        "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "name": "events",
        "outputs": [
        {
            "name": "eventId",
            "type": "uint256"
        },
        {
            "name": "min_deposit",
            "type": "uint256"
        },
        {
            "name": "name",
            "type": "string"
        },
        {
            "name": "start_time",
            "type": "uint256"
        },
        {
            "name": "end_time",
            "type": "uint256"
        },
        {
            "name": "event_balance",
            "type": "uint256"
        },
        {
            "name": "registeredCount",
            "type": "uint256"
        },
        {
            "name": "attendedCount",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "check_EventEnded",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "registered_Count",
        "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "registered_List",
        "outputs": [
        {
            "name": "",
            "type": "address[]"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "attended_List",
        "outputs": [
        {
            "name": "",
            "type": "address[]"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "attended_Count",
        "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        },
        {
            "name": "_addr",
            "type": "address"
        }
        ],
        "name": "attendEvent",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "contractBalance",
        "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "deposit_Balance",
        "outputs": [
        {
            "name": "",
            "type": "uint256"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        },
        {
            "name": "_addr",
            "type": "address"
        }
        ],
        "name": "check_Registered",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        },
        {
            "name": "_addr",
            "type": "address"
        }
        ],
        "name": "check_Attended",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "depositAndRegister",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [
        {
            "name": "_eventId",
            "type": "uint256"
        }
        ],
        "name": "rewardToAttendants",
        "outputs": [
        {
            "name": "",
            "type": "bool"
        }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "constructor"
        },
        {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "name": "_creator",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "_eventName",
            "type": "string"
        },
        {
            "indexed": false,
            "name": "_min_deposit",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "_start_time",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "_end_time",
            "type": "uint256"
        }
        ],
        "name": "EventCreated",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "name": "_startTime",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "_registered",
            "type": "bool"
        }
        ],
        "name": "EventStarted",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "name": "_endTime",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "_attended",
            "type": "bool"
        }
        ],
        "name": "EventEnded",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "name": "_eventId",
            "type": "uint256"
        },
        {
            "indexed": false,
            "name": "_addr",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
        }
        ],
        "name": "DepositAndRegistered",
        "type": "event"
        },
        {
        "anonymous": false,
        "inputs": [
        {
            "indexed": false,
            "name": "_to",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
        }
        ],
        "name": "Transfer",
        "type": "event"
        }
        ]
        const atrcontract = new web3.eth.Contract(contractABI, contractAddress)

        const data = atrcontract.methods.depositAndRegister(0).encodeABI()


        // get all accounts of current user
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.error(error);
                button.text('Register').removeAttr('disabled');
                return;
            }

            // get first (base) account
            var account = accounts[0];


            web3.eth.sendTransaction(txObject, (err, txHash) => {
              const txObject = {
                  from: web3.utils.toHex(account1),
                  nonce: web3.utils.toHex(txCount),
                  gasLimit: web3.utils.toHex(100000),
                  gasPrice: web3.utils.toHex(web3.utils.toWei('40', 'gwei')),
                  to: contractAddress,
                  data: data
                  // data is hexadecimal encoded representation of the actual function name of the smart contract
              }
            })

/**            App.contracts.AttendEnsure.deployed().then(function (adoptionInstance) {
                return adoptionInstance.depositAndRegister(0);
            })
                .then(function (result) {
                    alert('Deposit and Registration success!');
                    //return App.markAdopted();
                })
                .catch(function (err) {
                    // enable button again on error
                    button.text('Adopt').removeAttr('disabled');
                    console.log(err.message);
                });*/
        });
    },

//    markAdopted: function (adopters, account) {
//        // get deployed contract instance
//        App.contracts.Adoption.deployed().then(function (adoptionInstance) {
//            return adoptionInstance.getAdopters.call();
//        })
//            .then(function (adopters) {
//                // update owner info
//                adopters.forEach(function (adopter, i) {
//                    if (adopter !== '0x0000000000000000000000000000000000000000') {
//                        $('.panel-pet').eq(i).find('.pet-owner').text(adopter);
//                        $('.panel-pet').eq(i).find('button').text('Adopt').attr('disabled', false);
//                    }
//                });
//            })
//            .catch(function (err) {
//                console.error(err.message);
//            });
//    }
//
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
