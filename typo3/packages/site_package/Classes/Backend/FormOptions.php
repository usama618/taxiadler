<?php
declare(strict_types=1);
namespace Waldbyte\Adler\Backend;

use TYPO3\CMS\Form\Domain\DTO\SearchCriteria;
use TYPO3\CMS\Form\Mvc\Persistence\FormPersistenceManagerInterface;

final readonly class FormOptions
{
    public function __construct(private FormPersistenceManagerInterface $forms) {}

    public function items(array &$parameters): void
    {
        foreach ($this->forms->listForms([], new SearchCriteria()) as $form) {
            if (!$form->invalid && $form->persistenceIdentifier) {
                $parameters['items'][] = ['label' => $form->name, 'value' => $form->persistenceIdentifier];
            }
        }
    }
}
