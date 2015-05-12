
(function(window, $) {

    function enableNavScrollJump(){

        var nav = $("#mainNav");
        var navHeight = nav.height();
        var jumped = false;
        var threshold = 147;
        var animationDuration = 400;

        $(document).scrollTop(0); // ff
        setTimeout(function(){
            $(document).scrollTop(0); // chrome

            $(document).on('scroll', function(e){
                var scrollTop = this.body.scrollTop + this.documentElement.scrollTop; // chrome, ff
                if (!jumped && scrollTop > threshold){
                    nav.css("top", "-58px").addClass("scrolled");
                    nav.animate({ top: 0 }, animationDuration);
                    jumped = true;
                    return;
                }

                if (jumped && scrollTop <= threshold){
                    nav.animate({ top: "-58px" }, animationDuration/2, function(){
                        nav.css("top", "0").removeClass("scrolled");
                    });
                    jumped = false;
                    return;
                }

                // finish animation if user scrolls too fast
                if (scrollTop < navHeight){
                    nav.finish();
                }
            });
        }, 0);
    }

    function enableAjaxContactForm() {
        var form = $('#contactForm');

        form.submit(function(e){
            $.post(form.attr('action'), $('#contactForm').serialize(), function(data){
                console.log(data);
                if (data.success){
                    alert('Thanks for subscribing!');
                    form.reset();
                }

            }, 'json');

            e.preventDefault();
        });

    }

    var teamMembers = [
        {"id":17,"name":"David D. Lee","description":"Dr. David Lee is the Chairman and CEO of Dual Aperture, Inc., a Silicon Valley start-up focused on developing photography technologies capable of having a meaningful impact on people’s lives. He was the founder and CEO of Silicon Image and took the company public in 1999 serving as the company’s Chairman and CEO until November 2004. Responsible for the development of two worldwide digital interface standards – Digital Visual Interface (DVI) and High-Definition Multimedia Interface (HDMI) – Silicon Image is recognized as a major force in the development and implementation of technology industry standards. While at Silicon Image, Lee forged the collaborative relationships with leading PC and consumer electronics manufacturers including Intel, Sony and Panasonic, along with major Hollywood studios, to bring DVI and HDMI standards to fruition. In 2009, HDMI was awarded the Technology and Engineering Emmy Award by National Academy of Television Arts \u0026 Sciences (NATAS). According to several market research firms, more than 3 billion HDMI-enabled devices shipped from its inception through 2014. Lee was inducted into CEA Hall of Fame in 2014 for his contribution in HDMI. Prior to launching Silicon Image in 1995, Lee was a principal investigator at Sun Microsystems Research Laboratories and the research staff at the famed Xerox Palo Alto Research Center (PARC). There, he led a number of projects including the development of the world’s first 6.3M pixel AMLCDs, which integrated high-resolution display technology with high-performance computing. A technology entrepreneur standout, Lee received his bachelor’s (’83, with honors), master’s (‘85) and Ph.D. (’89) degrees in electrical engineering and computer science from U.C. Berkeley.","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/17/davidLeeProfile.png","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/17/thumb_davidLeeProfile.png"}},"nickname":"CEO","company":"Dual Aperture","position":1},
        {"id":25,"name":"Chong-Min Kyung","description":"Chong-Min Kyung is Professor at the Department of Electrical Engineering(EE) at KAIST and Director of Center for Integrated Smart Sensors(CISS), funded as Global Frontier Project by Korean government. He is responsible for all operations and overall strategic direction of CISS. His research interest is low-energy 3-D camera system design. Previously, Prof. Kyung worked at Bell Telephone Murray Hill. He received Ph.D. in EE at KAIST 1981. He is IEEE Fellow.","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/25/Chong-Min__Kyung_2.jpg","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/25/thumb_Chong-Min__Kyung_2.jpg"}},"nickname":"CTO","company":"CISS","position":2},
        {"id":33,"name":"Chung Kon Ko","description":"Dr. Ko joins Dual Aperture International as Chief Legal Officer. He is actively involved in the industry, academia, as well as government positions. Prior to DAI, Dr. Ko served as EVP of intellectual Discovery (Korea’s first Invention Capital company), where his primary responsibilities included acquisition and licensing of patent portfolios of more than one thousand patents. Previously, he was Vice President at LG Electronics, where he was responsible for patent development, litigation, and monetization and served as Vice President at Samsung Electronics where he was responsible for joint venture, technology sourcing, and developing standards-based patents. He is a US Patent Attorney registered to practice in New York, New Jersey, and US PTO.  He worked at law firms, Pennie \u0026 Edmonds (New York) and Kim and Chang (Seoul). Dr. Ko served the IP Committee Chair at Korea’s National Science and Technology Commission, setting the national IP policy and allocating government R\u0026D budgets. He was also a Council Member of Korea’s Presidential Council on Intellectual Property, who coordinated various government branches for patents, designs, copyrights, trademarks, and antitrust matters. Dr. Ko received his bachelor degree in EECS from MIT, and master and Ph.D degrees in EE from Columbia University and a Law Degree (J.D.) from Rutgers Law School. Dr. Ko also teaches and writes extensively in the areas of IP development, litigation, and monetization. He is the author of “Dr. Ko’s Creative Economy Lecture: Manage Your Intellectual Properties” (©2014, Human and Books), and co-author of “US Patent Law Case Study” (©2013, Hanbit IP Center). Dr. Ko taught IP as an adjunct professor at Seoul National University and at the Korea Advanced Institute of Science and Technology (KAIST).","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/33/CK_Ko.jpg","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/33/thumb_CK_Ko.jpg"}},"nickname":"Chief Legal Officer","company":"Dual Aperture","position":3},
        {"id":18,"name":"Andrew Wajs","description":"Andrew has great experience in creating new product ideas by drawing upon diverse disciplines and technologies. He has exhibited photographs in galleries in South Africa and the Netherlands and has since shifted into designing and building cameras. Prior to Dual Aperture, Andrew worked in various aspects of the media technology industry, including a previous position as the CTO of Irdeto. He holds BSc and MSc degrees in Electrical Engineering from the University of the Witwatersrand.","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/18/andrewWajsProfile.png","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/18/thumb_andrewWajsProfile.png"}},"nickname":"Chief Architect","company":"Dual Aperture","position":4},
        {"id":34,"name":"Gang-Sik Roh","description":"GS is the lead manager responsible for the business operation such as HR, finance, general administration as well as X-functional project management on our customers and strategic partners. Prior to DAI, GS served as VP of the Siliconfile technology(CMOS image sensor company in Korea), where his primary responsibilities included strategic business planning and management support division. Also he worked in Dongbu HiTek and Siliconfile as sales and marketing director. He likes to socialize with people.","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/34/GS_Roh.jpg","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/34/thumb_GS_Roh.jpg"}},"nickname":"VP, Business Operations","company":"Dual Aperture","position":5},
        {"id":24,"name":"Taekun Woo","description":"TK is the lead engineer responsible for the image enhancement and depth map generation algorithms and the packaging of applications/libraries to deliver DA’s algorithm to customers.  Prior to starting Dual Aperture, TK worked for over 15 years with embedded systems in Silicon Valley and Orange County. He received his BS and MS in Computer Science from Korea University.","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/24/tkWooProfile.png","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/24/thumb_tkWooProfile.png"}},"nickname":"VP, Engineering","company":"Dual Aperture","position":6},
        {"id":19,"name":"Bruce Lee","description":"The resident sensei of corporate operations and business development, Bruce is a veteran of over two decades in the IT industry.  Prior to joining DA, Bruce worked in several industry-leading companies such as Synnex Group, Phoenix, and PQI in the Greater China Region. He received his BS in Electrical Engineering from Chung-Yuan Christian University in Taiwan and in his free time enjoys hitting the little white ball across the great green plains.","picture":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/19/bruceLeeProfile.png","thumb":{"url":"https://dual-aperture.s3.amazonaws.com/uploads/team_member/picture/19/thumb_bruceLeeProfile.png"}},"nickname":"Greater China Operations","company":"Dual Aperture","position":7}
    ];

    function getTeamMemberDetails(id){
        var result = {};
        $.each(teamMembers, function(){
            if (this.id === id){
                result = this;
            }
        });
        return result;
    }

    function attachMemberDetailModal(){
        $(".member_modal_link").click(function(){
            var $this = $(this);
            var id = $(this).data('id');
            var data = getTeamMemberDetails(id);

            $('.member_name').text(data.name);
            $('.company_title').text(data.nickname || '');
            $('.modal-body p').text(data.description);

            $("#portraitModal").modal('show');

            return false;
        });

        $("#portraitModal").modal({ show: false });
    }

    function init(){
        enableAjaxContactForm();
        attachMemberDetailModal();
    }

    $(init);

    $(window).load(enableNavScrollJump);

})(this, this.jQuery);
