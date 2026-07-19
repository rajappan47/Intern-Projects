
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Menu Activation Flow
  const hamburger = document.getElementById('hamburgerMenu');
  const navbar = document.querySelector('.navbar');
  const modalOverlay = document.getElementById('signupModal');

  function openModal() {
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
     //document.body.style.overflow = "visible";
    document.documentElement.style.overflow = "";
}

  const products = ['Overview', 'Pricing', 'Marketplace', 'Features', 'Integrations'];
  const companies = ['About', 'Team', 'Blog', 'Careers'];
  const connects = ['Contact', 'Newsletter', 'LinkedIn'];


  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      const existingMenu = document.querySelector('.nav-links-mobile-container');
      
      if (existingMenu) {
        existingMenu.remove();
        navbar.classList.remove('mobile-active');
      } else {
        navbar.classList.add('mobile-active');
        const menuContainer = document.createElement('div');
        menuContainer.className = 'nav-links-mobile-container';

        menuContainer.innerHTML = `
          <div class="dropdown">
            <a href="#" class="dropbtn" onclick="toggleMobileSubmenu(event)">Product <span class="arrow"></span></a>
            <div class="dropdown-content">
              ${products.map(item => `<a href="#">${item}</a>`).join('')}
            </div>
          </div>
          <div class="dropdown">
            <a href="#" class="dropbtn" onclick="toggleMobileSubmenu(event)">Company <span class="arrow"></span></a>
            <div class="dropdown-content">
              ${companies.map(item => `<a href="#">${item}</a>`).join('')}
            </div>
          </div>
          <div class="dropdown">
            <a href="#" class="dropbtn" onclick="toggleMobileSubmenu(event)">Connect <span class="arrow"></span></a>
            <div class="dropdown-content">
              ${connects.map(item => `<a href="#">${item}</a>`).join('')}
            </div>
          </div>
          <div class="mobile-divider"></div>
          <div class="mobile-auth">
            <a href="#" class="btn-login">Login</a>
            <a href="#" id="mobileSignUpTrigger" class="btn-signup">Sign Up</a>
          </div>
        `;
        navbar.appendChild(menuContainer);

        document.getElementById('mobileSignUpTrigger').addEventListener('click', (e) => {
          e.preventDefault();
          //modalOverlay.classList.add('active');
          openModal();
          menuContainer.remove();
          hamburger.classList.remove('active');
          navbar.classList.remove('mobile-active');
          //document.body.style.overflow = 'hidden';
        });
      }
    });
  }

  // Desktop Main Signup Activation Hook Listener
  const signUpBtn = document.querySelector('.btn-signup');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (signUpBtn && modalOverlay) {
    signUpBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Blocks actual page routing redirect
      //modalOverlay.classList.add('active');
      //document.body.style.overflow = 'hidden';
       openModal();
    });
  }

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      closeModal();
      //modalOverlay.classList.remove('active');
    });
  }

  window.addEventListener('click', (event) => {
    //if (event.target === modalOverlay) {
      //modalOverlay.classList.remove('active');
    //}
    //document.body.style.overflow = 'auto';
  });
});

function toggleMobileSubmenu(event) {
  event.preventDefault();
  const dropdownContent = event.currentTarget.nextElementSibling;
  const arrow = event.currentTarget.querySelector('.arrow');
  
  if (dropdownContent.style.display === 'block') {
    dropdownContent.style.display = 'none';
    arrow.style.transform = 'rotate(45deg)';
  } else {
    dropdownContent.style.display = 'block';
    arrow.style.transform = 'rotate(-135deg)';
  }
}