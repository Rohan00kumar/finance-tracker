package com.finance.tracker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SPAForwardController {
    
    @RequestMapping(value = "/{path:[^\\.]*}")
    public String redirect() {
        // Forward all non-file requests (paths without a dot) to the React application's index.html
        return "forward:/index.html";
    }
}
