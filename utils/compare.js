module.exports =  function compare(array ){ 
    
    let newArr=[]
    for (let i = 0; i < array.length; i++) {
        newArr[i] =array[i].createdAt
    }
    let arr = newArr.map( date => date.split('-'))

    for(let j = 0 ; j<3 ;j++){
        for (let i =0; i<((arr.length-1)-j) ; i++){
        if(arr[i][2]>arr[i+1][2]){
            console.log("year bada hai no isuue")
            break;
        }else if(arr[i][2] == arr[i+1][2]){
            console.log("year bara bar hai ")
            if(arr[i][1] > arr[i+1][1]){
                console.log("month bada hai no isuue")
                break;
            }else if(arr[i][1] == arr[i+1][1]){
                console.log("month bara bar hai")
                if(arr[i][0] > arr[i+1][0]){
                    console.log('date badi hai')
                    break;
                } else if(arr[i][0] == arr[i+1][0]){
                    console.log('date same hai')
                    break;
                }else{
                    console.log("date choti hai")
                    let term1 = arr[i]
                    arr[i] =arr[i+1]
                    arr[i+1] = term1 ;
                    let term = array[i]
                    array[i] =array[i+1]
                    array[i+1] = term ;
                    console.log('swaped')
                }
            }else{
                console.log("month chota hai ")
                let term1 = arr[i]
                arr[i] =arr[i+1]
                arr[i+1] = term1 ;
                let term = array[i]
                array[i] =array[i+1]
                array[i+1] = term ;
                
                console.log('swaped')
            }
        }else{
            console.log("year chota hai")
            let term1 = arr[i]
            arr[i] =arr[i+1]
            arr[i+1] = term1 ;
            let term = array[i]
            array[i] =array[i+1]
            array[i+1] = term ;
            console.log('swaped')
        }
    }
    }
    return array 
    
}