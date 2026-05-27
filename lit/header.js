import { LitElement, html } from "../../assets/js/vendor/lit.js";

export class Header extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="container container-header">
        <div class="row">
          <div class="col-lg-12">
            <div class="header-four-wrapper">
              <div class="nav-area">
                <nav>
                  <ul class="parent-nav">
                    <li class="has-dropdown doesnt-have-mr">
                      <a class="nav-link" href="#">
                        Rates
                        <img
                          src="/assets/images/icons/sackers-chevron.svg"
                          class="injectable chevron"
                          alt=""
                        />
                      </a>
                      <ul class="submenu parent-nav with-border">
                        <li>
                          <a href="greens-fees.html">
                            <img
                              src="/assets/images/icons/sackers-chevron.svg"
                              class="injectable chevron"
                              alt=""
                            /><span class="text">Greens Fees</span></a
                          >
                        </li>
                        <li>
                          <a href="membership-fees.html">
                            <img
                              src="/assets/images/icons/sackers-chevron.svg"
                              class="injectable chevron"
                              alt=""
                            />
                            <span class="text">Memberships</span>
                          </a>
                        </li>
                        <!-- <li>
                          <a href="meet-the-team.html">
                            <img
                              src="/assets/images/icons/sackers-chevron.svg"
                              class="injectable chevron"
                              alt=""
                            />
                            <span class="text">Meet the Team</span>
                          </a>
                        </li> -->
                      </ul>
                    </li>
                    <li>
                      <a href="/golf-lessons.html" class="nav-link">Golf Lessons</a>
                    </li>
                    <!-- <li>
                      <a href="/course-layout.html" class="nav-link">
                        Course Layout
                      </a>
                    </li> -->
                    <li>
                      <a href="/calendar.html" class="nav-link"> Calendar </a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div class="button-area-right-header">
                <div class="menu-btn-toggle">
                  <svg
                    width="25"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect y="12" width="25" height="1" fill="#1F1F25"></rect>
                    <rect y="6" width="25" height="1" fill="#1F1F25"></rect>
                    <rect width="25" height="1" fill="#1F1F25"></rect>
                  </svg>
                </div>
              </div>
              <a href="index.html" class="logo-container">
                <img
                  src="/assets/images/logo/occ-hero-logo.svg"
                  alt=""
                  class="logo logo-white"
                />
                <img
                  src="/assets/images/logo/occ-logo.svg"
                  alt=""
                  class="logo logo-dark injectable"
                />

                <!-- 🔸🔸🔸 mobile logos 🔸🔸🔸 -->
                <img
                  src="/assets/images/logo/OCC-Logo-Long.svg"
                  alt=""
                  class="mobile-logo mobile-logo-white"
                />
                <img
                  src="/assets/images/logo/OCC-Logo-Long-Dark.svg"
                  alt=""
                  class="mobile-logo mobile-logo-dark"
                />
              </a>
              <div class="nav-area">
                <nav>
                  <ul class="parent-nav">
                    <li>
                      <a href="/contact.html" class="nav-link">Info</a>
                    </li>
                    <li>
                      <a href="/contact.html#message-us" class="nav-link">
                        Message Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="book-tee-time.html"
                        class="rts-btn btn-primary my-btn book-tee-time-btn"
                      >
                        Book Tee Time
                        <img
                          class="injectable"
                          src="assets/images/icons/14.svg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("my-header", Header);
