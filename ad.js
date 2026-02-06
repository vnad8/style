(function () {
  const POPUP_ROOT_ID = "ad-popup-root";
  const BANNER_ROOT_ID = "ad-banner-root";

  function injectCSS(cssText) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = cssText;
    document.head.appendChild(style);
  }

  function createPopup(options) {

    if (document.getElementById(POPUP_ROOT_ID)) return;

    const overlay = document.createElement("div");
    overlay.id = POPUP_ROOT_ID;

    overlay.innerHTML = `
      <div class="ad-popup-mask"></div>
      <div class="ad-popup-box" style="width:${options.width}px;max-width:80%;aspect-ratio: ${options.width} / ${options.height};">
        <a class="ad-popup-link"
           href="${options.link}"
           target="_blank"
           rel="nofollow">
          <img src="${options.image}" width="${options.width}" height="${options.height}" alt="quảng cáo" />
        </a>
        <span class="ad-popup-close">×</span>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector(".ad-popup-close").addEventListener("click", function (e) {
      e.stopPropagation();
      overlay.remove();
    });
  }

  function createBanner(options) {
    let bannerRoot = document.getElementById(BANNER_ROOT_ID);
    if (!bannerRoot) {
      bannerRoot = document.createElement("div");
      bannerRoot.id = BANNER_ROOT_ID;
      

      const toggleBtn = document.createElement("div");
      toggleBtn.className = "ad-banner-toggle";
      toggleBtn.innerHTML = "▼"; 
      bannerRoot.appendChild(toggleBtn);

      let isCollapsed = false;
      toggleBtn.addEventListener("click", function() {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
          bannerRoot.classList.add("ad-collapsed");
          toggleBtn.innerHTML = "▲";
        } else {
          bannerRoot.classList.remove("ad-collapsed");
          toggleBtn.innerHTML = "▼";
        }
      });

      document.body.appendChild(bannerRoot);
    }

    const bannerBox = document.createElement("div");
    bannerBox.className = "ad-banner-box";

    const heightStyle = options.height ? `height:${options.height}px;` : '';
    const widthAttr = options.width ? `width="${options.width}"` : '';
    const heightAttr = options.height ? `height="${options.height}"` : '';

    if (heightStyle) {
        bannerBox.style.cssText = heightStyle;
    }

    bannerBox.innerHTML = `
      <a class="ad-banner-link"
         href="${options.link}"
         target="_blank"
         rel="nofollow">
        <img src="${options.image}" alt="quảng cáo" ${widthAttr} ${heightAttr} />
      </a>
    `;

    
    bannerRoot.appendChild(bannerBox);
  }

  function buildCSS() {
    return `
/* Popup Styles */
#${POPUP_ROOT_ID} {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
}

#${POPUP_ROOT_ID} .ad-popup-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.84);
}

#${POPUP_ROOT_ID} .ad-popup-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
}

#${POPUP_ROOT_ID} .ad-popup-link,
#${POPUP_ROOT_ID} .ad-popup-link img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

#${POPUP_ROOT_ID} .ad-popup-close {
  position: absolute;
  top: -10px;
  right: 13px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: #000;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  font-size: 32px;
  font-family: Arial, sans-serif;
  border: 2px solid #fff;
}
#${POPUP_ROOT_ID} .ad-popup-close:hover {background: #ff0000;}

#${BANNER_ROOT_ID} {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999998;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 5px 0;
  gap: 10px;
  transition: transform 0.3s ease-in-out;
}


#${BANNER_ROOT_ID}.ad-collapsed {
  transform: translateY(100%);
}


#${BANNER_ROOT_ID} .ad-banner-toggle {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 24px;
  line-height: 24px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  text-align: center;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
  font-size: 14px;
  user-select: none;
  z-index: 999999;
}


#${BANNER_ROOT_ID} .ad-banner-box {
  position: relative;
  max-width: 33%;
  flex-shrink: 1; 
}

#${BANNER_ROOT_ID} .ad-banner-link img {
  display: block;
  max-width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: contain;
}


@media (max-width: 768px) {
    #${BANNER_ROOT_ID} {
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    #${BANNER_ROOT_ID} .ad-banner-box {
        max-width: 100%; 
    }
}
`;
  }

  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
      setTimeout(fn, 0);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  window.AdPopup = {
    init: function (options) {
      if (!options || !options.image || !options.link) {
        console.error("AdPopup: image and link are required for popup");
        return;
      }
      onReady(function () {
        injectCSS(buildCSS());
        createPopup(options);
      });
    },
    initBanner: function (options) {
      if (!options || !options.image || !options.link) {
        console.error("AdPopup: image and link are required for banner");
        return;
      }
      onReady(function () {
        injectCSS(buildCSS()); 
        createBanner(options);
      });
    }
  };
  
  let cssInjected = false;
  const originalInjectCSS = injectCSS;
  injectCSS = function(css) {
      if(cssInjected) return;
      originalInjectCSS(css);
      cssInjected = true;
  };

  window.AdPopup.init({
    image: "https://pub-e658d2b69e604cdba2ef90be9d9f8e6f.r2.dev/click.webp",
    width: 300,
    height: 250,
    link: "https://ccfao.com"
  });

  
  window.AdPopup.initBanner({
    image: "https://pub-e658d2b69e604cdba2ef90be9d9f8e6f.r2.dev/mmoo.webp", 
    link: "https://ccfao.com"
  });
  

})();


function goToBaseHost() {
  window.open("https://ccfao.com", "_blank", "noopener,noreferrer");
}


var _Hasync= _Hasync|| [];
_Hasync.push(['Histats.start', '1,5001252,4,0,0,0,00000000']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
hs.src = ('//s10.histats.com/js15_as.js');
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();

