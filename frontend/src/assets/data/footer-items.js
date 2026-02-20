import { FaCar, FaEarthAmericas, FaHotel, FaPlane } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { FaHandsHelping } from "react-icons/fa";
import { LuMessageCircleQuestion } from "react-icons/lu";
import { IoNewspaper } from "react-icons/io5";

const footerLinks = [
  {
    title: "Page",
    items: [
      {
        name: "About us",
        link: "/pages/about",
      },
      {
        name: "Contact us",
        link: "/pages/contact",
      },
      {
        name: "News and Blog",
        link: "/blogs/blog",
      },
      {
        name: "Meet a Team",
        link: "/pages/our-team",
      },
      {
        name: "FAQ",
        link: "/faqs",
      },
      {
        name: "Help Center",
        link: "/help/center",
      },
    ],
  },
  {
    title: "Link",
    items: [
      {
        name: "Sign up",
        link: "/auth/sign-up",
      },
      {
        name: "Sign in",
        link: "/auth/sign-in",
      },
      {
        name: "Privacy Policy",
        link: "/help/privacy-policy",
      },
      {
        name: "Terms",
        link: "/help/service",
      },
      {
        name: "Cookie",
      },
      {
        name: "Support",
        link: "/help/center",
      },
    ],
  },
  {
  title: "Locations",
  items: [
    { name: "Kochi" },
    { name: "Thiruvananthapuram" },
    { name: "Kozhikode" },
    { name: "Alappuzha" },
    { name: "Palakkad" },
    { name: "Malappuram" },
  ],
},
  {
    title: "Menu",
    items: [
      {
        name: "Home",
        icon: FaHome,
        link: "/hotels/home",
      },
      {
        name: "About Us",
        icon: IoPeopleSharp,
        link: "/pages/about",
      },
      {
        name: "FAQs",
        icon: LuMessageCircleQuestion,
        link: "/faqs",
      },
      {
        name: "Blogs",
        icon: IoNewspaper,
        link: "/blogs/blog",
      },
    ],
  },
];
const topLinks = [
  // {
  //   name: "Flights",
  //   link: "/flights/home",
  // },
  {
    name: "Hotels",
    link: "/hotels/home",
  },
  // {
  //   name: "Tour",
  //   link: "/tours/home",
  // },
  // {
  //   name: "Cabs",
  //   link: "/cabs/home",
  // },
  {
    name: "About",
    link: "/pages/about",
  },
  {
    name: "Contact us",
    link: "/pages/contact",
  },
  {
    name: "Blogs",
    link: "/blogs/blog",
  },
  {
    name: "Services",
    link: "/help/service",
  },
  // {
  //   name: "Detail page",
  //   link: "/directories/detail",
  // },
  // {
  //   name: "Policy",
  //   link: "/help/privacy-policy",
  // },
  // {
  //   name: "Testimonials",
  //   link: "/hotels/home#hotels-home-testimonial",
  // },
  // {
  //   name: "Newsletters",
  //   link: "/blogs/detail",
  // },
  // {
  //   name: "Podcasts",
  // },
  // {
  //   name: "Protests",
  // },
  // {
  //   name: "NewsCyber",
  // },
  // {
  //   name: "Education",
  // },
  // {
  //   name: "Sports",
  // },
  // {
  //   name: "Tech and Auto",
  // },
  // {
  //   name: "Opinion",
  // },
  // {
  //   name: "Share Market",
  // },
];
export { footerLinks, topLinks };
