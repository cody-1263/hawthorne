

<template>
  
  <!-- <div class="lds-grid">
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div> -->
  
  <div class="loader quantum-spinner"></div>
  
</template>


<style>








/*
The loaders use CSS custom properties (variables) to control the attributes of the loaders
*/
:root{
	--loader-width: 2rem;
	--loader-height: 2rem;
	--loader-color-primary: #fff;
	--loader-color-secondary: #eee;
	--line-width: 0.1rem;
	--animation-duration: 1s;
	--loader-initial-scale: 0.1;
}
.loader,.loader:before,.loader:after{
	box-sizing: border-box;
	flex-grow: 0;
	flex-shrink: 0;
}
/*
In order to get optimal results, please only change the 
variables above and don't change anything in the actual loader code
*/
	
	


@keyframes momentum {
    0%   { 
        transform: rotate(0deg);  
    }
    100% {
        transform: rotate(-360deg);
    }
}

.loader.quantum-spinner {
    --primary-circle-offset: calc(((var(--loader-width,100px) * 0.2) / 2) - var(--line-width,4px));
    --secondary-circle-offset: calc(((var(--loader-width,100px) * 0.4) / 2) - var(--line-width,4px)); /*- (var(--line-width,4px) * 2)*/
    width: var(--loader-width, 100px);
    height: var(--loader-height, 100px);
    transform-origin: center center;
    border-radius: 50%;
    border: var(--line-width, 4px) solid rgba(0,0,0,0);
    border-top-color: var(--loader-color-primary, #33f);
    animation: momentum var(--animation-duration, 1s) linear infinite; 
}

.quantum-spinner:before {
    content: "";
    position: absolute;
    transform-origin: center center;
    top: var(--primary-circle-offset,10px);
    left: var(--primary-circle-offset,10px);
    width: calc(var(--loader-width,100px) * 0.8);
    height: calc(var(--loader-height,100px) * 0.8);
    border-radius: 50%;
    border: var(--line-width,4px) solid rgba(0,0,0,0);
    border-top-color: var(--loader-color-primary, #33f);
    opacity: 0.7;
    filter: hue-rotate(3eg);
    animation: momentum calc(var(--animation-duration, 1s) * 2) linear infinite; 
}

.quantum-spinner:after {
    content: "";
    position: absolute;
    top: var(--secondary-circle-offset,20px);
    left: var(--secondary-circle-offset,20px);
    width: calc(var(--loader-width,100px) * 0.6);
    height: calc(var(--loader-height,100px) * 0.6);
    border-radius: 50%;
    transform-origin: center center;
    border: var(--line-width,4px) solid rgba(0,0,0,0);
    border-top-color: var(--loader-color-primary, #33f);
    opacity: 0.3;
    filter: hue-rotate(6eg);
    animation: momentum var(--animation-duration, 1s) linear infinite; 
}











.lds-grid {
  width: 80px;
  height: 80px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4rem;
}
.lds-grid div {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  animation: lds-grid 1.2s linear infinite;
}
.lds-grid div:nth-child(1) {
  top: 8px;
  left: 8px;
  animation-delay: 0s;
}
.lds-grid div:nth-child(2) {
  top: 8px;
  left: 32px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(3) {
  top: 8px;
  left: 56px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(4) {
  top: 32px;
  left: 8px;
  animation-delay: -0.4s;
}
.lds-grid div:nth-child(5) {
  top: 32px;
  left: 32px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(6) {
  top: 32px;
  left: 56px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(7) {
  top: 56px;
  left: 8px;
  animation-delay: -0.8s;
}
.lds-grid div:nth-child(8) {
  top: 56px;
  left: 32px;
  animation-delay: -1.2s;
}
.lds-grid div:nth-child(9) {
  top: 56px;
  left: 56px;
  animation-delay: -1.6s;
}
@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

</style>