import { FaCar, FaEarthAmericas, FaHotel, FaPlane } from 'react-icons/fa6';
import { IoMailOpenOutline } from "react-icons/io5";
import { IoNewspaper } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const footerLinks = [{
  title: 'Page',
  items: [{
    name: 'About us',
    link: '/pages/about'
  }, {
    name: 'Contact us',
    link: '/pages/contact'
  }, {
    name: 'News and Blog',
    link: '/blogs/blog'
  }, {
    name: 'Meet a Team',
    link: '/pages/our-team'
  }]
}, {
  title: 'Link',
  items: [{
    name: 'Sign up',
    link: '/auth/sign-up'
  }, {
    name: 'Sign in',
    link: '/auth/sign-in'
  }, {
    name: 'Privacy Policy',
    link: '/help/privacy-policy'
  }, {
    name: 'Terms',
    link: '/help/service'
  }, {
    name: 'Cookie'
  }, {
    name: 'Support',
    link: '/help/center'
  }]
}, {
  title: 'Global Site',
  items: [{
    name: 'India'
  }, {
    name: 'California'
  }, {
    name: 'Indonesia'
  }, {
    name: 'Canada'
  }, {
    name: 'Malaysia'
  }]
}, {
  title: 'Booking',
  items: [{
    name: 'Hotel',
    icon: FaHotel,
    link: '/hotels/home'
  }, {
    name: 'Contact',
    icon: IoMailOpenOutline,
    link: '/pages/contact'
  }, {
    name: 'Blogs',
    icon: IoNewspaper,
    link: '/blogs/blog'
  }, {
    name: 'Sign in',
    icon: CgProfile,
    link: '/auth/sign-in'
  }]
}];
const topLinks = [{
  name: 'Flights',
  link: '/flights/home'
}, {
  name: 'Hotels',
  link: '/hotels/home'
}, {
  name: 'Tour',
  link: '/tours/home'
}, {
  name: 'Cabs',
  link: '/cabs/home'
}, {
  name: 'About',
  link: '/pages/about'
}, {
  name: 'Contact us',
  link: '/pages/contact'
}, {
  name: 'Blogs',
  link: '/blogs/blog'
}, {
  name: 'Services',
  link: '/help/service'
}, {
  name: 'Detail page',
  link: '/directories/detail'
}, {
  name: 'Policy',
  link: '/help/privacy-policy'
}, {
  name: 'Testimonials',
  link: '/hotels/home#hotels-home-testimonial'
}, {
  name: 'Newsletters',
  link: '/blogs/detail'
}, {
  name: 'Podcasts'
}, {
  name: 'Protests'
}, {
  name: 'NewsCyber'
}, {
  name: 'Education'
}, {
  name: 'Sports'
}, {
  name: 'Tech and Auto'
}, {
  name: 'Opinion'
}, {
  name: 'Share Market'
}];
export { footerLinks, topLinks };