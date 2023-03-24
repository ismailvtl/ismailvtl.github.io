let items = document.querySelectorAll('.top-picks button');
let selectedItem = document.querySelector('.selected-item');


let data = {
    "propertyTitle" : "فيلا للبيع الربوة ، الرياض",
    "price" : "6,950,000",
    "sar": "ر.س",
    "address" : "الربوة، وسط الرياض، الرياض",
    "bathroom" : '3',
    "bedroom" : '2',
    "area": '700',
    "whatsapp": '+966566655559',
    "call": '+966566655559'

}

items.forEach(function(item, index){
    item.addEventListener('click', function(e){
        // let imgurl = e.target.getAttribute('src');
        selectedItem.querySelector('.image-slider').classList.add(`moveTo${index+1}`);
        document.querySelector('body').classList.add(`slide${index+1}`);
        setTimeout(function(){
            selectedItem.classList.add('activate');
            document.querySelector('.tik').style.opacity = "1";
            document.querySelector('button#close').style.opacity = "1";
        }, 200);
        console.log(item.children[0].naturalHeight, item.children[0].naturalWidth, item.children[0].naturalHeight > item.children[0].naturalWidth);

        if(item.children[0].naturalHeight > item.children[0].naturalWidth) {
            console.log("portrait", index);
            document.querySelector('.image-slider').children[index].style.animation = "video-portrait 34s forwards";
        } else {
            console.log("landscape", index);
            document.querySelector('.image-slider').children[index].style.animation = "video-landscape 34s forwards";
            
        }
    })
});




document.querySelector('.selected-item').addEventListener("touchstart", handleTouchStart, { passive: false });
document.querySelector('.selected-item').addEventListener("touchmove", handleTouchMove, { passive: false });

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleTouchStart(evt) {
  // evt.preventDefault();
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}


function handleTouchMove(evt) {
  // evt.preventDefault();
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;


  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
        if(document.querySelector('body').classList.contains('slide1')) {
            document.querySelector('.image-slider').classList.add('moveLeft');
        }
        if(document.querySelector('body').classList.contains('slide2')) {
            document.querySelector('.image-slider').classList.add('moveLeft');
        }
        console.log("left");
    } else {
        console.log("right");
        if(document.querySelector('body').classList.contains('slide1')) {
            document.querySelector('.image-slider').classList.remove('moveLeft');
        }
        if(document.querySelector('body').classList.contains('slide2')) {
            document.querySelector('.image-slider').classList.remove('moveLeft');
        }
    }
  } else {
    if (yDiff > 0) {
        console.log("up");
        if(document.querySelector('body').classList.contains('slide1')) {
            document.querySelector('.image-slider').classList.remove('moveTo1');
            document.querySelector('.image-slider').classList.add('moveTo2');
            document.querySelector('.selected-item.activate img:first-child').style.animation = "none";
            document.querySelector('.selected-item.activate img:nth-child(2)').style.animation ="video-portrait 20s forwards";
        }

        if(document.querySelector('body').classList.contains('slide2')) {
            document.querySelector('.image-slider').classList.remove('moveTo1');
            document.querySelector('.image-slider').classList.add('moveTo2');
            document.querySelector('.selected-item.activate img:nth-child(2)').style.animation ="video-portrait 20s forwards";
            document.querySelector('.selected-item.activate img:first-child').style.animation = "none";
        }

    } else {
        console.log("down");
        if(document.querySelector('body').classList.contains('slide2')) {
            document.querySelector('.image-slider').classList.remove('moveTo2');
            document.querySelector('.image-slider').classList.add('moveTo1');
            document.querySelector('.selected-item.activate img:nth-child(2)').style.animation = "none";
            document.querySelector('.selected-item.activate img:first-child').style.animation = "video-landscape 20s forwards";
        }

        if(document.querySelector('body').classList.contains('slide1')) {
            document.querySelector('.image-slider').classList.remove('moveTo2');
            document.querySelector('.image-slider').classList.add('moveTo1');
            document.querySelector('.selected-item.activate img:first-child').style.animation = "video-landscape 20s forwards";
            document.querySelector('.selected-item.activate img:nth-child(2)').style.animation = "none";
        }
    }
  }

  /* reset values */
  xDown = null;
  yDown = null;

}



document.querySelector('#close').addEventListener('click', function() {
    document.querySelector('body').classList.remove('slide1');
    document.querySelector('body').classList.remove('slide2');
    document.querySelector('.selected-item').classList.remove('activate');
    document.querySelector('.image-slider').classList.remove('moveTo1');
    document.querySelector('.image-slider').classList.remove('moveTo2');
    document.querySelector('#img1').style.animation = "none";
    document.querySelector('#img2').style.animation = "none";
    document.querySelector('.tik').style.opacity = "0";
    
  })