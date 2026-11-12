<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'Cookie Consent',
    'description' => 'TYPO3 v14 cookie consent banner with opt-in script activation.',
    'category' => 'fe',
    'constraints' => [
        'depends' => [
            'typo3' => '14.0.0-14.9.99',
            'frontend' => '14.0.0-14.9.99',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'App\\CookieConsent\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'clearCacheOnLoad' => 1,
    'author' => '',
    'author_email' => '',
    'author_company' => '',
    'version' => '1.0.0',
];
