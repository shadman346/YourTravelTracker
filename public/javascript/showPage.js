
// Map geo coding

mapboxgl.accessToken = MapToken;
    var map = new mapboxgl.Map({
    container: 'map-box', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: destination.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
    });


    var marker = new mapboxgl.Marker({
        draggable: true
        })
        .setLngLat(destination.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset:25}) 
                .setHTML(
                    `<h3>${destination.title}</h3><p>${destination.location}</p>`
                )
        )
        .addTo(map)
         
    function onDragEnd() {
    var lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    coordinates.innerHTML =
    'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    }
         
    marker.on('dragend', onDragEnd);


    var layerList = document.getElementById('map-radio-btn');
    var inputs = layerList.getElementsByTagName('input');

        function switchLayer(layer) {
        var layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
        }

        for (var i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer;
        }

// ================================================================================

//text box ===
function getScrollHeight(elm){
    var savedValue = elm.value
    elm.value = ''
    elm._baseScrollHeight = elm.scrollHeight
    elm.value = savedValue
    }
    let countText=document.querySelector('#counttext')
    countText.innerHTML=document.querySelector('#text-exp-rem').value.length

    function onExpandableTextareaInput({ target:elm }){
    // make sure the input event originated from a textarea and it's desired to be auto-expandable
    if( !elm.classList.contains('autoExpand') || !elm.nodeName == 'TEXTAREA' ) return
    
    var minRows = elm.getAttribute('data-min-rows')|0, rows;
    !elm._baseScrollHeight && getScrollHeight(elm)
    
    elm.rows = minRows
    rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 25)
    
    elm.rows = minRows + rows 

    countText.innerHTML=elm.value.length;
    }
    // global delegated event listener
    document.addEventListener('input', onExpandableTextareaInput)


//===================================================================


const btn_exp_rem = document.querySelector('#btn-exp-rem');
        const text_exp_rem = document.querySelector('#text-exp-rem');
        const _3btn = document.querySelector('#_3btndiv');
        const _2btn = document.querySelector('#_2btndiv');
        const btnCancel=document.querySelectorAll('#_2btndiv button')[0];
        const btnUpdate=document.querySelectorAll('#_2btndiv button')[1];
        const your_exp=document.querySelector('#your-exp');
        const muted=document.querySelector('#muted');
        
        const map_box = document.querySelector('#map-div')
        const maptoggle = document.querySelector('#map-crousel-div');
        const crouselDiv = document.querySelector('#carouselExampleControls');
        const btnMapShow = document.querySelector('#btn-map');
        const coord_div = document.querySelector('#coordinates')
        
        const showToggle=function(){
         muted.classList.toggle("d-none");
         _3btn.classList.toggle("d-none");
        _2btn.classList.toggle("d-none");
        your_exp.classList.toggle("d-none")
        }
        
        

        const Map_Crousel_Toggle=function(e){
            map_box.classList.toggle("height-map")
            maptoggle.classList.toggle("height-map") 
            crouselDiv.classList.toggle("d-none");
            coord_div.classList.toggle("d-none");
            // if(e.target.innerHTML=="Map")
            if(this.innerHTML=="Map")
                this.innerHTML=`<span class="p-2"></span>Images <i class="fas fa-images"></i>`
            else
                this.innerHTML="Map"
            
        }
        

        btn_exp_rem.addEventListener('click', showToggle);
        btnCancel.addEventListener('click',showToggle);

        btnMapShow.addEventListener('click',Map_Crousel_Toggle);

        if(destination.images.length==0){
            btnMapShow.innerHTML="Images"
            map_box.classList.toggle("height-map")
            maptoggle.classList.toggle("height-map") 
            crouselDiv.classList.toggle("d-none");
            coord_div.classList.toggle("d-none");
        }

    var body =  document.querySelector('body');
    body.style.backgroundImage="url('https://res.cloudinary.com/shady346/image/upload/v1616790082/YourTravelTracker/promotional/watercolor-light-blue-purple-ombre-background-painting-texture_145343-379_afirxn.jpg')";
    body.style.backgroundPosition="center center";
    body.style.backgroundRepeat="";
    body.style.backgroundSize="cover";
    body.style.height="100%";